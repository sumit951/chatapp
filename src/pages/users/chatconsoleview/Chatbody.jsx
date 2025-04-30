import React, { useState, useEffect, useRef} from 'react'
import axiosConfig,{ BASE_URL } from '../../../axiosConfig';
import moment from 'moment'
import InputEmoji from 'react-input-emoji'
import Replies from './Replies';
import Pinnedhistory from './Pinnedhistory';

const Chatbody = ({socket, messages, lastMessageRef,typingStatus,chatdataFromChild, onEditMessage, onDeleteMsg,newArrchatdataFromChild,onReplyMessage,onQuotedMessage,messageRefs,highlightId,receiverId}) => {

    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const topRef = useRef(null);

    //console.log(chatdataFromChild);

    //console.log(messages);
    //console.log(newArrchatdataFromChild);
    /* if(newArrchatdataFromChild.length>0)
    {
        chatdataFromChild = newArrchatdataFromChild
    } */

    const [chatdata, setchatdata] = useState([]);

    useEffect(() => {
        
        setchatdata(chatdataFromChild)
        if(newArrchatdataFromChild.length>0)
        {
            setchatdata(newArrchatdataFromChild)
        }
        socket.on('reloadpinStatusUpdated', async (data) => {
            //console.log(data);
            try {
                const encodeReceiverId = btoa(data.receiverId)
                const response = await axiosConfig.get(`/chat/getuserchat/${encodeReceiverId}`)
                if(response.status==200)
                {
                    //const token = localStorage.getItem(token)
                    if(response.status !== 200)
                    {
                        navigate('/login')
                    }   
                    
                }
                //console.log(response.data);
                
                setchatdata(response.data)
            } catch (error) {
                console.log(error.message);
            }
            /* if(data.pinSts=='Yes')
            {
                pinnedMessages.push(data.messageId)
            }
            if(data.pinSts=='No')
            {
                setPinnedMessages(prevItems => prevItems.filter(item => item.id !== data.messageId));
            } */
            chatdata.map(item => {
            // You can perform any logic here before updating
            item.pinSts == 'Yes' && !pinnedMessages.includes(item.messageId) ? pinnedMessages.push(item.messageId) :null
            });
        })
        
    }, [socket,chatdataFromChild,newArrchatdataFromChild,chatdata]);

    const handleScroll = async() => {
        //console.log(topRef.current.scrollTop);
        
    /* if (topRef.current.scrollTop === 0) {
        await loadMessages(receiverId);
        slice().reverse().
    } */
    };
    
  return (
    <>
        <div className="modal-body" ref={topRef}
            onScroll={handleScroll}>
            <div className="msg-body">
            
            <ul>  
            {chatdata.map((chatdata) =>
            (chatdata.messageId!=null) ? (
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li 
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefs.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                className={`
                    ${(chatdata.deleteSts=='No') ? "sender" : "deletedmsg"}
                    message-container`}
                >
                

                {(chatdata.deleteSts=='No') ? <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}
                {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(chatdata.pinSts=='Yes') ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span> : null}
                <p>
                    {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>You deleted your message. {moment(chatdata.timestamp).format('llll')}</span>  }
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'senderReplybox'} messageRefs={messageRefs} onDeleteMsg={onDeleteMsg} onEditMessage={onEditMessage} highlightId={highlightId} />
                
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                

                </li>
            ) : (
                <li 
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefs.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                className={`${(chatdata.deleteSts=='No') ? "repaly" : "deletedmsg"}
                
                message-container`}
                >
                
                {(chatdata.deleteSts=='No') ? <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')}   {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(chatdata.pinSts=='Yes') ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span> : null}
                <p>
                {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>{chatdata.senderName} deleted their own message. {moment(chatdata.timestamp).format('llll')}</span>  }
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'receiverReplybox'} messageRefs={messageRefs} onDeleteMsg={onDeleteMsg} onEditMessage={onEditMessage} highlightId={highlightId} />
                
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                </li>
            )) : ( <b></b> )
            )}



            {messages.map((chatdata) =>
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className={`sender message-container`}
                    key={chatdata.messageId}
                    ref={(el) => {
                    if (el) messageRefs.current[chatdata.messageId] = el;
                    }}
                    id={chatdata.messageId}
                >

                

                <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(chatdata.pinSts=='Yes') ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} />
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'senderReplybox'} messageRefs={messageRefs} onDeleteMsg={onDeleteMsg} onEditMessage={onEditMessage} highlightId={highlightId}  />
                
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                

                </li>
            ) : (
                <li className={`repaly`}  
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefs.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                >
                <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(chatdata.pinSts=='Yes') ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} />
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'receiverReplybox'} messageRefs={messageRefs} onDeleteMsg={onDeleteMsg} onEditMessage={onEditMessage} highlightId={highlightId} />
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                </li>
            )
            )}
            </ul>
            <div className="message__status">
            {/* <p>{typingStatus}</p> */}
            </div>
            </div>
            {highlightId===null && <div ref={lastMessageRef} />}
        </div>
    </>
  )
}

export default Chatbody