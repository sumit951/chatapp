import React, { useState, useEffect,useRef } from 'react'
import moment from 'moment'
import axiosConfig,{ BASE_URL } from '../../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import InputEmoji from 'react-input-emoji'

const Repliesgroup = ({socket, parentMessageId, boxtype, messageRefsGroup,onDeleteMsgGroup,onEditMessageGroup,groupMemberdataFromChild,highlightIdGroup}) => {

    const lastReplyMessageRef = useRef(null);
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    const token = localStorage.getItem('chat-token-info')
    
  

    //console.log(messages);
    //console.log(newArrchatdataFromChild);
    
    const transformMessage = (message) => {
        // Regular expression to match mentions in the format @name(userId:number)
        const mentionRegex = /@\[([^\]]+)\](\(userId:(\d+)\))/g;
        
        // Replace mentions with <span> tags containing userId as data attribute
        return message.replace(mentionRegex, (match, userName, userTag, userId) => {
            return `&nbsp;<span class="tagg--text" data-userid="${userId}">@${userName}</span>&nbsp;`;
        });
    };

    const [userChatData, setUserChatData] = useState([]);
    
    const fetchrepliedmessages = async(parentMessageId) => {
        //console.log(parentMessageId);
        try {
            const response = await axiosConfig.get(`/chat/getrepliedmessagesgroup/${parentMessageId}`)
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
            setUserChatData([])
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
        lastReplyMessageRef.current?.scrollIntoView({ block: "end"});
    }, [userChatData]);
    //lastReplyMessageRef.current?.scrollIntoView({ block: "end"});

    useEffect(() => {
        socket.on('messagegroupResponseReply', (data) => { 
            if(parentMessageId === data.replyTo)
            {
                //console.log(data);
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
        socket.on('updatedMessageGroup', (updatedMsg) => {
            //console.log(data);
            if(parentMessageId)
            {
                fetchrepliedmessages(parentMessageId)
            }
        })
    }, [socket,parentMessageId,userChatData]);
    
    const userforTag = groupMemberdataFromChild.filter(item => item.userId !== chatboardUserid);
    const mockUsers = 
        userforTag.map((user,i) => (
        {
        id: user.userId,
        name: user.userName,
        shortName: user.usershortName
        }
    ));

    const searchMention = (message) => {
        if (!message) {
        return [];
        }

        const filteredText = message.substring(1).toLocaleLowerCase();

        return mockUsers.filter(user => {
        if (user.name.toLocaleLowerCase().startsWith(filteredText)) {
        return true;
        }

        const names = user.name.split(" ");

        return names.some(name =>
        name.toLocaleLowerCase().startsWith(filteredText)
        );
        });
    }

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
                if (el) messageRefsGroup.current[chatdata.messageId] = el;
                }}
                >
                

                {(chatdata.deleteSts=='No') ? <span className="replyBoxtime"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}
                {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                <p> 
                    {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>You deleted your message. {moment(chatdata.timestamp).format('llll')}</span>  }
                    
                
                </p>
               

                </li>
            ) : (
                <li className={`${(chatdata.deleteSts=='No') ? "repalyRply" : "deletedmsg"}`} key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefsGroup.current[chatdata.messageId] = el;
                }}>
                
                {(chatdata.deleteSts=='No') ? <span className="replyBoxtime"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                <p>
                {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>{chatdata.senderName} deleted their own message. {moment(chatdata.timestamp).format('llll')}</span>  }
                </p>
                </li>
            )) : ( <b></b> )
            )}
            </ul>
           
            </div>
            {highlightIdGroup===null && <div ref={lastReplyMessageRef} />}
        </div>}
    </>
  )
}

export default Repliesgroup