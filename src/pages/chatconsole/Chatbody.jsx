import React, { useState, useEffect, useRef} from 'react'
import axiosConfig,{ BASE_URL } from '../../axiosConfig';
import moment from 'moment'
import InputEmoji from 'react-input-emoji'

import Replies from './Replies';
import Pinnedhistory from './Pinnedhistory';

const Chatbody = ({socket, messages, lastMessageRef,typingStatus,chatdataFromChild, onEditMessage, onDeleteMsg,newArrchatdataFromChild,onReplyMessage,onQuotedMessage,messageRefs,highlightId,receiverId}) => {

    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const topRef = useRef(null);

    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    //console.log(chatdataFromChild);

    //console.log(messages);
    //console.log(newArrchatdataFromChild);
    /* if(newArrchatdataFromChild.length>0)
    {
        chatdataFromChild = newArrchatdataFromChild
    } */

    const [chatdata, setchatdata] = useState([]);
    const [pinnedMessages, setPinnedMessages] = useState([]);
    
    /* useEffect(() => {
        
        socket.on('reloaddeleteMessage', async (data) => {
            //console.log(data);
            
            try {
                const encodeReceiverId = btoa(data.senderid)
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
        })
        
    }, [socket]); */


    useEffect(() => {
        chatdata.map(item => {
        // You can perform any logic here before updating
        item.pinSts == 'Yes' && !pinnedMessages.includes(item.messageId) ? pinnedMessages.push(item.messageId) :null
        });
        setchatdata(chatdataFromChild)
        if(newArrchatdataFromChild.length>0)
        {
            setchatdata(newArrchatdataFromChild)
        }
                
    }, [chatdataFromChild,newArrchatdataFromChild,chatdata,pinnedMessages]);
    
    useEffect(() => {
        const handlePinStatusUpdate = (data) => {
            //let newSts = (data.pinSts === 'Yes') ? 'No' : 'Yes';
            let newSts = data.pinSts

            const updatedChatData = chatdata.map(item => {
                if (item.messageId === data.messageId) {
                    const updatedItem = { ...item, pinSts: newSts };
    
                    if (newSts === 'Yes' && !pinnedMessages.includes(item.messageId)) {
                        pinnedMessages.push(item.messageId);
                    }
    
                    return updatedItem;
                }
                return item;
            });
    
            setchatdata(updatedChatData);
        };
    
        socket.on('reloadpinStatusUpdated', handlePinStatusUpdate);
    
        return () => {
            socket.off('reloadpinStatusUpdated', handlePinStatusUpdate);
        };
    }, [socket, chatdata, pinnedMessages]);
    

    const handleMouseEnter = (messageId) => {
    setHoveredMessageId(messageId);
    };

    const handleMouseLeave = () => {
    setHoveredMessageId(null);
    };

    const [editingMessage, setEditingMessage] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
    
    const [replyContent, setReplyContent] = useState('');
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const handleReplyClick = (messageId) => {
        setSelectedMessageId(messageId);
    };

    const updateStateFromChild = (newState) => {
        setSelectedMessageId(newState);
    };

    const handleCancelReply = (messageId) => {
        setSelectedMessageId(null);
    };

    const postReply = async() => {
        if (selectedMessageId && replyContent) {
            if(replyContent.trim())
            {
            const replyMessageData = { messageId:selectedMessageId, newMessage: replyContent };
            //console.log(replyMessageData);
            
            onReplyMessage(replyMessageData);
            setReplyContent('');
            setSelectedMessageId(null);
            }
            else
            {
                alert('Plesase enter some text message')
            }
        }
        else
        {
            alert('Plesase enter some text message')
        }
    };


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

    
    const handleQuoteMessage = (id, content,sender) => {
        const quotedMessageData = { messageId:id,quoteMessage:content,sender:sender };
        onQuotedMessage(quotedMessageData);
        //console.log(quotedMessageData);
    };

    //console.log(pinnedMessages);
    
    const togglePin = async (messageId,pinSts,receiverId) => {
        //console.log(pinSts);
        
        try {
            //console.log(id);
            if(!confirm('Please Conifrm')) return false;
            
            setPinnedMessages((prevPinned) =>
            prevPinned.includes(messageId)
                ? prevPinned.filter((id) => id !== messageId)
                : [...prevPinned, messageId]
            );

            setPinnedMessages((prevPinned) => {
                if (pinSts=='Yes') {
                    // Add messageId if it's not already in the list
                    return prevPinned.includes(messageId)
                        ? prevPinned
                        : [...prevPinned, messageId];
                } else {
                    // Remove messageId if it's in the list
                    return prevPinned.filter((id) => id !== messageId);
                }
            });

            const encodeMessageId = btoa(messageId)
            const postData = {pinnedbyName:localStorage.getItem('loggedInUserName'),groupId:null,receiverId:receiverId}
            const response = await axiosConfig.put(`/chat/updatepinstatus/${encodeMessageId}/${pinSts}`,postData)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                } 
                socket.emit('pinStatusUpdated', {pinSts:pinSts,receiverId:receiverId,messageId:messageId});
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    
    
    /* const loadMessages = async(receiverId) => {
        
        try {
            const encodeReceiverId = btoa(receiverId)
            console.log(offset);
            const response = await axiosConfig.get(`/chat/getuserchat/${encodeReceiverId}?offset=${offset}`)
            if(response.data.length > 0)
            {   
                console.log(response.data.length);
            
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                }   
                setchatdata(prev => [...response.data.slice().reverse(), ...prev]);
                setOffset(prev => prev + 2);
            }
            else
            {
            setHasMore(false);
            }
            //console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }    
    }
    useEffect(() => {
    loadMessages(receiverId);
    }, [receiverId]); */
    const handleScroll = async() => {
        //console.log(topRef.current.scrollTop);
        
    /* if (topRef.current.scrollTop === 0) {
        await loadMessages(receiverId);
        slice().reverse().
    } */
    };

    const lastMsgRef = useRef(null);

    useEffect(() => {
        if (lastMsgRef.current) {
        lastMsgRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        let timeCount = 500;
        const timer = setTimeout(() => {
            if (lastMessageRef.current && highlightId===null) {
                setTimeout(() => lastMessageRef.current.scrollIntoView({ block: "end" }), 500); 
                
            }
        }, timeCount);

        return () => clearTimeout(timer);
        
    }, [chatdataFromChild,highlightId]); // Trigger scroll when message changes
    
    

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
                    ${(chatdata.deleteSts=='No' && editingMessageId !== chatdata.messageId) ? "sender" : "deletedmsg"}
                    ${(selectedMessageId === chatdata.messageId) ? "replymsg" : ""} 
                    message-container`}
               
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

                {(chatdata.deleteSts=='No') ? <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}
                {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(pinnedMessages.includes(chatdata.messageId)) ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span> : null}
                <p>
                    {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>You deleted your message. {moment(chatdata.timestamp).format('llll')}</span>  }
                    
                {((hoveredMessageId === chatdata.messageId) && chatdata.deleteSts=='No') && (
                    <span className="message-actions float-end ms-3">
                    <a
                        className="quote-button"
                        onClick={() => handleQuoteMessage(chatdata.messageId, chatdata.message, chatdata.senderName)}
                        title="Quote Message"
                    >
                        <i className='fa fa-quote-right'></i>
                    </a>
                    <a
                        className="reply-button"
                        onClick={() => handleReplyClick(chatdata.messageId)}
                        title="Start Thread"
                    >
                        <i className='fa fa-reply'></i>
                    </a>
                    <a
                        className="edit-button"
                        onClick={() => handleEditClick(chatdata.message,chatdata.messageId)}
                    >
                        <i className='fa fa-pencil'></i>
                    </a>
                    <a
                        className="delete-button"
                        onClick={() => onDeleteMsg(chatdata.messageId)}
                    >
                        <i className='fa fa-trash'></i>
                    </a>
                    {/* <a className="delete-button" onClick={() => togglePin(chatdata.messageId,chatdata.pinSts,chatdata.receiverId)}>
                    {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                    </a> */}
                    <a className="delete-button" 
                      onClick={() => {
                        if (pinnedMessages.includes(chatdata.messageId)) {
                          // Call for unpin logic
                          togglePin(chatdata.messageId, 'Yes', chatdata.receiverId);
                        } else {
                          // Call for pin logic
                          togglePin(chatdata.messageId, 'No', chatdata.receiverId);
                        }
                      }}
                    >
                    {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                    </a>
                    </span>
                )}
                </p>
                {(chatdata.deleteSts=='No') ? <>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'senderReplybox'} updateStateFromChild={updateStateFromChild} messageRefs={messageRefs} onDeleteMsg={onDeleteMsg} onEditMessage={onEditMessage} highlightId={highlightId} onQuotedMessage={onQuotedMessage} />
                {selectedMessageId === chatdata.messageId && (
                <span>
                    <InputEmoji
                    value={replyContent}
                    onChange={setReplyContent}
                    cleanOnEnter
                    /* onEnter={handleSaveEdit} */
                    placeholder="Type a message"
                    shouldReturn
                    />
                    <button onClick={() => postReply(chatdata.messageId)}>Post Reply</button>
                    <button onClick={() => handleCancelReply(chatdata.messageId)}>Cancel</button>
                </span>
                )}
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} /></>
                : null }
                

                </>
            )}

                </li>
            ) : (
                <li 
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefs.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                className={`${(chatdata.deleteSts=='No') ? "repaly" : "deletedmsg"}
                ${(selectedMessageId === chatdata.messageId) ? "replymsg" : ""}
                message-container`}
                
                onMouseEnter={() => handleMouseEnter(chatdata.messageId)}
                onClick={() => handleMouseEnter(chatdata.messageId)}
                onMouseLeave={handleMouseLeave}
                >
                
                {(chatdata.deleteSts=='No') ? <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')}   {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(pinnedMessages.includes(chatdata.messageId)) ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span> : null}
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
                    <a
                        className="reply-button"
                        onClick={() => handleReplyClick(chatdata.messageId)}
                        title="Start Thread"
                    >
                        <i className='fa fa-reply'></i>
                    </a>
                    {/* <a className="delete-button" onClick={() => togglePin(chatdata.messageId,chatdata.pinSts,chatdata.receiverId)}>
                    {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                    </a> */}
                    <a className="delete-button" 
                      onClick={() => {
                        if (pinnedMessages.includes(chatdata.messageId)) {
                          // Call for unpin logic
                          togglePin(chatdata.messageId, 'Yes', chatdata.receiverId);
                        } else {
                          // Call for pin logic
                          togglePin(chatdata.messageId, 'No', chatdata.receiverId);
                        }
                      }}
                    >
                    {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                    </a>
                    </span>
                )}
                </p>
                {(chatdata.deleteSts=='No') ? <>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'receiverReplybox'} updateStateFromChild={updateStateFromChild} messageRefs={messageRefs} onDeleteMsg={onDeleteMsg} onEditMessage={onEditMessage} highlightId={highlightId} onQuotedMessage={onQuotedMessage} />
                {selectedMessageId === chatdata.messageId && (
                <span>
                    <InputEmoji
                    value={replyContent}
                    onChange={setReplyContent}
                    cleanOnEnter
                    /* onEnter={handleSaveEdit} */
                    placeholder="Type a message"
                    shouldReturn
                    />
                    <button onClick={() => postReply(chatdata.messageId)}>Post Reply</button>
                    <button onClick={() => handleCancelReply(chatdata.messageId)}>Cancel</button>
                </span>
                )}
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} /></>
                : null }
                </li>
            )) : ( <b></b> )
            )}



            {messages.map((chatdata) =>
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className={`${(editingMessageId !== chatdata.messageId) ? "sender" : "deletedmsg"} 
                    ${(selectedMessageId === chatdata.messageId) ? "replymsg" : ""}
                    message-container`}
                    key={chatdata.messageId}
                    /* ref={(el) => {
                    if (el) messageRefs.current[chatdata.messageId] = el;
                    }} */
                    ref={chatdata.messageId === messages.length - 1 ? lastMsgRef : null}
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

                <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(pinnedMessages.includes(chatdata.messageId)) ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} />
                {hoveredMessageId === chatdata.messageId && (
                    <span className="message-actions float-end ms-3">
                    <a
                        className="quote-button"
                        onClick={() => handleQuoteMessage(chatdata.messageId, chatdata.message, chatdata.senderName)}
                        title="Quote Message"
                    >
                        <i className='fa fa-quote-right'></i>
                    </a>
                    <a
                        className="reply-button"
                        onClick={() => handleReplyClick(chatdata.messageId)}
                        title="Start Thread"
                    >
                        <i className='fa fa-reply'></i>
                    </a>
                    <a
                        className="edit-button"
                        onClick={() => handleEditClick(chatdata.message,chatdata.messageId)}
                    >
                        <i className='fa fa-pencil'></i>
                    </a>
                    <a
                        className="delete-button"
                        onClick={() => onDeleteMsg(chatdata.messageId)}
                    >
                        <i className='fa fa-trash'></i>
                    </a>
                    {/* <a className="delete-button" onClick={() => togglePin(chatdata.messageId,chatdata.pinSts,chatdata.receiverId)}>
                    {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                    </a> */}
                    <a className="delete-button" 
                      onClick={() => {
                        if (pinnedMessages.includes(chatdata.messageId)) {
                          // Call for unpin logic
                          togglePin(chatdata.messageId, 'Yes', chatdata.receiverId);
                        } else {
                          // Call for pin logic
                          togglePin(chatdata.messageId, 'No', chatdata.receiverId);
                        }
                      }}
                    >
                    {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                    </a>
                    </span>
                )}
                </p>
                {(chatdata.deleteSts=='No') ? <>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'senderReplybox'} updateStateFromChild={updateStateFromChild} messageRefs={messageRefs} onDeleteMsg={onDeleteMsg} onEditMessage={onEditMessage} highlightId={highlightId} onQuotedMessage={onQuotedMessage}  />
                {selectedMessageId === chatdata.messageId && (
                <span>
                    <InputEmoji
                    value={replyContent}
                    onChange={setReplyContent}
                    cleanOnEnter
                    /* onEnter={handleSaveEdit} */
                    placeholder="Type a message"
                    shouldReturn
                    />
                    <button onClick={() => postReply(chatdata.messageId)}>Post Reply</button>
                    <button onClick={() => handleCancelReply(chatdata.messageId)}>Cancel</button>
                </span>
                )}
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} /></>
                : null }
                </>
                )}

                </li>
            ) : (
                <li className={`repaly ${(selectedMessageId === chatdata.messageId) ? "replymsg" : ""}`}  
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefs.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                onMouseEnter={() => handleMouseEnter(chatdata.messageId)}
                onClick={() => handleMouseEnter(chatdata.messageId)}
                onMouseLeave={handleMouseLeave}
                >
                <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(pinnedMessages.includes(chatdata.messageId)) ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} />
                {((hoveredMessageId === chatdata.messageId) && chatdata.deleteSts=='No') && (
                    <span className="message-actions float-end ms-3">
                    <a
                        className="quote-button"
                        onClick={() => handleQuoteMessage(chatdata.messageId, chatdata.message, chatdata.senderName)}
                        title="Quote Message"
                    >
                        <i className='fa fa-quote-right'></i>
                    </a>
                    <a
                        className="reply-button"
                        onClick={() => handleReplyClick(chatdata.messageId)}
                        title="Start Thread"
                    >
                        <i className='fa fa-reply'></i>
                    </a>
                    {/* <a className="delete-button" onClick={() => togglePin(chatdata.messageId,chatdata.pinSts,chatdata.receiverId)}>
                    {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                    </a> */}
                    <a className="delete-button" 
                      onClick={() => {
                        if (pinnedMessages.includes(chatdata.messageId)) {
                          // Call for unpin logic
                          togglePin(chatdata.messageId, 'Yes', chatdata.receiverId);
                        } else {
                          // Call for pin logic
                          togglePin(chatdata.messageId, 'No', chatdata.receiverId);
                        }
                      }}
                    >
                    {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                    </a>
                    </span>
                )}
                </p>
                {(chatdata.deleteSts=='No') ? <>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'receiverReplybox'} updateStateFromChild={updateStateFromChild} messageRefs={messageRefs} onDeleteMsg={onDeleteMsg} onEditMessage={onEditMessage} highlightId={highlightId} onQuotedMessage={onQuotedMessage} />
                {selectedMessageId === chatdata.messageId && (
                <span>
                    <InputEmoji
                    value={replyContent}
                    onChange={setReplyContent}
                    cleanOnEnter
                    /* onEnter={handleSaveEdit} */
                    placeholder="Type a message"
                    shouldReturn
                    />
                    <button onClick={() => postReply(chatdata.messageId)}>Post Reply</button>
                    <button onClick={() => handleCancelReply(chatdata.messageId)}>Cancel</button>
                </span>
                )}
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} /></>
                : null }
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