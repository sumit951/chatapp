import React, { useState,useEffect }  from 'react'
import axiosConfig,{ BASE_URL } from '../../axiosConfig';
import moment from 'moment'
import InputEmoji from 'react-input-emoji'
import Replies from './Repliesgroup';
import Pinnedhistory from './Pinnedhistory';

const Chatgroupbody = ({socket, messages, lastMessageGroupRef,typingStatusgroup,groupchatdataFromChild, onEditMessageGroup, onDeleteMsgGroup,newArrgroupchatdataFromChild,onReplyMessageGroup,onQuotedMessageGroup,messageRefsGroup}) => {
    
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    //console.log(messages);
    //console.log(groupchatdataFromChild);
    const [groupchatdata, setgroupchatdata] = useState([]);
    const [pinnedMessages, setPinnedMessages] = useState([]);

    useEffect(() => {
        groupchatdata.map(item => {
        // You can perform any logic here before updating
        item.pinSts == 'Yes' && !pinnedMessages.includes(item.messageId) ? pinnedMessages.push(item.messageId) :null
        });
        setgroupchatdata(groupchatdataFromChild)
        if(newArrgroupchatdataFromChild.length>0)
        {
            setgroupchatdata(newArrgroupchatdataFromChild)
        }
        socket.on('reloadpinStatusUpdated', async (data) => {
            //console.log(data);
            try {
                const encodeGroupId = btoa(data.groupId)
                const response = await axiosConfig.get(`/chat/getgroupchat/${encodeGroupId}`)
                if(response.status==200)
                {
                    //const token = localStorage.getItem(token)
                    if(response.status !== 200)
                    {
                        navigate('/login')
                    }   
                    
                }
                //console.log(response.data);
                
                setgroupchatdata(response.data)
            } catch (error) {
                console.log(error.message);
            }

            groupchatdata.map(item => {
            // You can perform any logic here before updating
            item.pinSts == 'Yes' && !pinnedMessages.includes(item.messageId) ? pinnedMessages.push(item.messageId) :null
            });
        })
        
    }, [socket,groupchatdataFromChild,newArrgroupchatdataFromChild,groupchatdata]);

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
            
            onReplyMessageGroup(replyMessageData);
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
        console.log(message);
        
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
        console.log(updatedMessageDate);
        
        onEditMessageGroup(updatedMessageDate);
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
        const quotedMessageDataGroup = { messageId:id,quoteMessage:content,sender:sender };
        onQuotedMessageGroup(quotedMessageDataGroup);
        //console.log(quotedMessageDataGroup);
    };

    
    //console.log(pinnedMessages);
    
    const togglePin = async (messageId,pinSts,groupId) => {
        console.log(pinSts);
        
        try {
            //console.log(id);
            if(!confirm('Please Conifrm')) return false;
            
            setPinnedMessages((prevPinned) =>
            prevPinned.includes(messageId)
                ? prevPinned.filter((id) => id !== messageId)
                : [...prevPinned, messageId]
            );

            const encodeMessageId = btoa(messageId)
            const postData = {pinnedbyName:localStorage.getItem('loggedInUserName'),groupId:groupId,receiverId:null}
            const response = await axiosConfig.put(`/chat/updatepinstatus/${encodeMessageId}/${pinSts}`,postData)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                } 
                socket.emit('pinStatusUpdated', {pinSts:pinSts,groupId:groupId,messageId:messageId});
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    /* Convert Tag message */
    const transformMessage = (message) => {
        // Regular expression to match mentions in the format @name(userId:number)
        const mentionRegex = /@\[([^\]]+)\](\(userId:(\d+)\))/g;
        
        // Replace mentions with <span> tags containing userId as data attribute
        return message.replace(mentionRegex, (match, userName, userTag, userId) => {
          return `&nbsp;<span class="tagg--text" data-userid="${userId}">@${userName}</span>&nbsp;`;
        });
    };
    /* Convert Tag message */
    //console.log(messageRefsGroup);

    return (
    <>
        <div className="modal-body chatarea">
            <div className="msg-body">
            <ul>
            {groupchatdata.map((chatdata) =>
            (chatdata.messageId!=null) ? (
                
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className={`${(chatdata.deleteSts=='No' && editingMessageId !== chatdata.messageId) ? "sender" : "deletedmsg"} 
                ${(selectedMessageId === chatdata.messageId) ? "replymsg" : ""} 
                message-container`} 
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefsGroup.current[chatdata.messageId] = el;
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
                {(chatdata.deleteSts=='No') ? <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}  {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(pinnedMessages.includes(chatdata.messageId)) ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span>  : null}
                
                <p>
                    {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: transformMessage(chatdata.message) }} /> : <span>You deleted your message. {moment(chatdata.timestamp).format('llll')}</span>  }                        
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
                            onClick={() => onDeleteMsgGroup(chatdata.messageId)}
                        >
                            <i className='fa fa-trash'></i>
                        </a>
                        <a className="delete-button" onClick={() => togglePin(chatdata.messageId,chatdata.pinSts,chatdata.groupId)}>
                        {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                        </a>
                        </span>
                    )}
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'senderReplybox'} updateStateFromChild={updateStateFromChild} messageRefsGroup={messageRefsGroup} />
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
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                </>
            )}
                </li>
            ) : (
                <li className={`${(chatdata.deleteSts=='No') ? "repaly" : "deletedmsg"}
                ${(selectedMessageId === chatdata.messageId) ? "replymsg" : ""}
                message-container`} 
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefsGroup.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                onMouseEnter={() => handleMouseEnter(chatdata.messageId)}
                onClick={() => handleMouseEnter(chatdata.messageId)}
                onMouseLeave={handleMouseLeave}
                >
                {(chatdata.deleteSts=='No') ? <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(pinnedMessages.includes(chatdata.messageId)) ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span> : null}
                <p>
                    {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: transformMessage(chatdata.message)}} /> : <span>{chatdata.senderName} deleted their own message. {moment(chatdata.timestamp).format('llll')}</span>  }
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
                        <a className="delete-button" onClick={() => togglePin(chatdata.messageId,chatdata.pinSts,chatdata.groupId)}>
                        {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                        </a>
                        </span>
                    )}
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'receiverReplybox'} updateStateFromChild={updateStateFromChild} messageRefsGroup={messageRefsGroup} />
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
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                </li>
            )) : ( <b>TEST</b> )
            )}
            
            
            
            {messages.map((chatdata) =>
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className={`${(editingMessageId !== chatdata.messageId) ? "sender" : "deletedmsg"} 
                    ${(selectedMessageId === chatdata.messageId) ? "replymsg" : ""}
                    message-container`}  
                    key={chatdata.messageId}
                    ref={(el) => {
                    if (el) messageRefsGroup.current[chatdata.messageId] = el;
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
                
                <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(pinnedMessages.includes(chatdata.messageId)) ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span>
                <p><span dangerouslySetInnerHTML={{__html: transformMessage(chatdata.message)}} />
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
                        onClick={() => onDeleteMsgGroup(chatdata.messageId)}
                    >
                        <i className='fa fa-trash'></i>
                    </a>
                    <a className="delete-button" onClick={() => togglePin(chatdata.messageId,chatdata.pinSts,chatdata.groupId)}>
                    {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                    </a>
                    </span>
                )}
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'senderReplybox'} updateStateFromChild={updateStateFromChild} messageRefsGroup={messageRefsGroup} />
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
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                </>
                )}

                </li>
            ) : (
                <li className={`${(chatdata.deleteSts=='No') ? "repaly" : "deletedmsg"}
                ${(selectedMessageId === chatdata.messageId) ? "replymsg" : ""}
                message-container`} 
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefsGroup.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                onMouseEnter={() => handleMouseEnter(chatdata.messageId)}
                onClick={() => handleMouseEnter(chatdata.messageId)}
                onMouseLeave={handleMouseLeave}
                >
                <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(pinnedMessages.includes(chatdata.messageId)) ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span>
                <p><span dangerouslySetInnerHTML={{__html: transformMessage(chatdata.message)}} />
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
                    <a className="delete-button" onClick={() => togglePin(chatdata.messageId,chatdata.pinSts,chatdata.groupId)}>
                    {(pinnedMessages.includes(chatdata.messageId)) ? 'Unpin' : 'Pin'}
                    </a>
                    </span>
                )}
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'receiverReplybox'} updateStateFromChild={updateStateFromChild} messageRefsGroup={messageRefsGroup} />
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
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                </li>
            )
            )}
            </ul>
            <div className="message__status">
            <p>{typingStatusgroup}</p>
            </div>
            {!messageRefsGroup && <div ref={lastMessageGroupRef} />}
            </div>
            
        </div>
    </>
  )
}

export default Chatgroupbody