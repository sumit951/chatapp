import React, { useState, useEffect,useRef } from 'react'
import moment from 'moment'
import axiosConfig,{ BASE_URL } from '../../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import InputEmoji from 'react-input-emoji'

const Replies = ({socket, parentMessageId, boxtype,messageRefs,onDeleteMsg, onEditMessage, highlightId}) => {
    //console.log(highlightId);
    
    const lastReplyMessageRef = useRef(null);
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    const token = localStorage.getItem('chat-token-info')

    //console.log(messages);

    //console.log(messages);
    //console.log(newArrchatdataFromChild);
    

    const [userChatData, setUserChatData] = useState([]);
    
    const fetchrepliedmessages = async(parentMessageId) => {
        //console.log(parentMessageId);
        try {
            const response = await axiosConfig.get(`/chat/getrepliedmessages/${parentMessageId}`)
            if(response.status==200)
            {
                if(response.status !== 200)
                {
                    navigate('/login')
                }   
                
            }
            //console.log(response.data);
            
            setUserChatData(response.data);
            
        } catch (error) {
            console.log(error.message);
            setUserChatData([]);
        }  
    }

    useEffect(() => {
        if(!token)
        {
            navigate('/login')
            //window.location.href = "/login";
        }
        fetchrepliedmessages(parentMessageId)
    }, [parentMessageId])

    useEffect(() => {
        socket.on('messageResponseReply', (data) => { 
        lastReplyMessageRef.current?.scrollIntoView({ block: "end"});
        });
    }, [socket]);
    //lastReplyMessageRef.current?.scrollIntoView({ block: "end"});

    useEffect(() => {
        socket.on('messageResponseReply', (data) => { 
            if(parentMessageId === data.replyTo)
            {
                console.log(data);
                setUserChatData([...userChatData, data])
            }
        })
        socket.on('reloaddeleteMessage', async (data) => {
            //console.log(data);
            if(parentMessageId)
            {
                fetchrepliedmessages(parentMessageId)
            }
        })
        socket.on('updatedMessage', (updatedMsg) => {
            //console.log(data);
            if(parentMessageId)
            {
                fetchrepliedmessages(parentMessageId)
            }
        })
    }, [socket,parentMessageId,userChatData]);

    
    
    
  return (
    <>
        
        {userChatData.length>0 && <div className="modal-body">
            <div className={`replyBox ${boxtype}`}>
            <ul>
            {userChatData.map((chatdata) =>
            (chatdata.messageId!=null) ? (
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className={`${(chatdata.deleteSts=='No') ? "senderRply" : "deletedmsg"}`}
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefs.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                >
                

                {(chatdata.deleteSts=='No') ? <span className="replyBoxtime"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}
                {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                <p> 
                    {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>You deleted your message. {moment(chatdata.timestamp).format('llll')}</span>  }
                </p>
                

                </li>
            ) : (
                <li className={`${(chatdata.deleteSts=='No') ? "repalyRply" : "deletedmsg"}`}  
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefs.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                >
                
                {(chatdata.deleteSts=='No') ? <span className="replyBoxtime"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                <p>
                {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>{chatdata.senderName} deleted their own message. {moment(chatdata.timestamp).format('llll')}</span>  }
                </p>
                </li>
            )) : ( <b></b> )
            )}
            </ul>
            </div>
            
            {highlightId===null && <div ref={lastReplyMessageRef} />}
        </div>
        }
    </>
  )
}

export default Replies