import React, { useState, useEffect,useRef } from 'react'
import moment from 'moment'
import axiosConfig,{ BASE_URL } from '../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import InputEmoji from 'react-input-emoji'

const Replies = ({socket, parentMessageId, boxtype,updateStateFromChild,messageRefs,onDeleteMsg, onEditMessage, highlightId,onQuotedMessage}) => {
    //console.log(highlightId);
    
    const lastReplyMessageRef = useRef(null);
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    const token = localStorage.getItem('chat-token-info')
    
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    //console.log(messages);

    //console.log(messages);
    //console.log(newArrchatdataFromChild);
    
    const handleMouseEnter = (messageId) => {
    setHoveredMessageId(messageId);
    };

    const handleMouseLeave = () => {
    setHoveredMessageId(null);
    };

    const handleReplyClick = async () => {
        updateStateFromChild(parentMessageId)
    }

    const [editingMessage, setEditingMessage] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);


    const handleEditClick = (message,messageId) => {
        setEditingMessage(message);
        setNewMessageText(message);
        setEditingMessageId(messageId);
    };

    const handleCancelEdit = (message,messageId) => {
        setEditingMessage(null);
        setNewMessageText('');
        setEditingMessageId(null);
    };

    const handleSaveEdit = async() => {
    if (newMessageText) {
        if(newMessageText.trim())
        {
        const updatedMessageDate = { messageId:editingMessageId,oldMessage:editingMessage, newMessage: newMessageText };
        //console.log(updatedMessageDate);
        
        onEditMessage(updatedMessageDate);
        setEditingMessage(null);
        setNewMessageText('');
        setEditingMessageId('');
        }
        else
        {
            alert('Plesase enter some updated text message')
        }
    }
    else
    {
        alert('Plesase enter updated message')
    }
    };

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
            if(data.parentMessageId)
            {
                fetchrepliedmessages(data.parentMessageId)
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

    const handleQuoteMessage = (id, content,sender) => {
        const quotedMessageData = { messageId:id,quoteMessage:content,sender:sender };
        onQuotedMessage(quotedMessageData);
        //console.log(quotedMessageData);
    };
    
    
  return (
    <>
        
        {userChatData.length>0 && <div className="modal-body">
            <div className={`replyBox ${boxtype}`}>
            <ul>
            {userChatData.map((chatdata) =>
            (chatdata.messageId!=null) ? (
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className={`${(chatdata.deleteSts=='No' && editingMessageId !== chatdata.messageId) ? "senderRply" : "deletedmsg"}`}
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefs.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                onMouseEnter={() => handleMouseEnter(chatdata.messageId)}
                onClick={() => handleMouseEnter(chatdata.messageId)}
                onMouseLeave={handleMouseLeave}
                >
                {editingMessage && editingMessageId === chatdata.messageId ? (
              <>
                <InputEmoji
                value={newMessageText}
                onChange={setNewMessageText}
                cleanOnEnter
                onEnter={handleSaveEdit}
                placeholder="Type a message"
                shouldReturn
                />
                {/*<input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                />*/}
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>

                {(chatdata.deleteSts=='No') ? <span className="replyBoxtime"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}
                {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                <p> 
                    {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>You deleted your message. {moment(chatdata.timestamp).format('llll')}</span>  }
                    
                {((hoveredMessageId === chatdata.messageId) && chatdata.deleteSts=='No') && (
                    <span className="message-actions float-end ms-3">
                    <a
                        className="edit-button"
                        onClick={() => handleEditClick(chatdata.message,chatdata.messageId)}
                    >
                        <i className='fa fa-pencil'></i>
                    </a>  
                    <a
                        className="delete-button"
                        onClick={() => onDeleteMsg(chatdata.messageId,parentMessageId)}
                    >
                        <i className='fa fa-trash'></i>
                    </a>
                    <a
                        className="quote-button"
                        onClick={() => handleQuoteMessage(chatdata.messageId, chatdata.message, chatdata.senderName)}
                        title="Quote Message"
                    >
                        <i className='fa fa-quote-right'></i>
                    </a>
                    </span>
                )}
                </p>
                </>
            )}

                </li>
            ) : (
                <li className={`${(chatdata.deleteSts=='No') ? "repalyRply" : "deletedmsg"}`}  
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefs.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                onMouseEnter={() => handleMouseEnter(chatdata.messageId)}
                onClick={() => handleMouseEnter(chatdata.messageId)}
                onMouseLeave={handleMouseLeave}
                >
                
                {(chatdata.deleteSts=='No') ? <span className="replyBoxtime"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                <p>
                {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>{chatdata.senderName} deleted their own message. {moment(chatdata.timestamp).format('llll')}</span>  }
                {((hoveredMessageId === chatdata.messageId) && chatdata.deleteSts=='No') && (
                    <span className="message-actions float-end ms-3">
                    <a
                        className="quote-button"
                        onClick={() => handleQuoteMessage(chatdata.messageId, chatdata.message, chatdata.senderName)}
                        title="Quote Message"
                    >
                        <i className='fa fa-quote-right'></i>
                    </a>
                    </span>
                )}
                </p>
                </li>
            )) : ( <b></b> )
            )}
            </ul>
            <a className="badge badge-waring" onClick={handleReplyClick}><i className='fa fa-reply'></i> Reply to thread</a>
            </div>
            
            {highlightId===null && <div ref={lastReplyMessageRef} />}
        </div>
        }
    </>
  )
}

export default Replies