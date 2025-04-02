import React, { useState }  from 'react'
import moment from 'moment'
import InputEmoji from 'react-input-emoji'
import Replies from './Repliesgroup';

const Chatgroupbody = ({socket, messages, lastMessageGroupRef,typingStatusgroup,groupchatdataFromChild, onEditMessageGroup, onDeleteMsgGroup,newArrgroupchatdataFromChild,onReplyMessageGroup}) => {
    
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    //console.log(messages);
    //console.log(groupchatdataFromChild);

    if(newArrgroupchatdataFromChild.length>0)
    {
        groupchatdataFromChild = newArrgroupchatdataFromChild
    }

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
    
  return (
    <>
        <div className="modal-body">
            <div className="msg-body">
            <ul>
            {groupchatdataFromChild.map((chatdata) =>
            (chatdata.messageId!=null) ? (
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className={`${(chatdata.deleteSts=='No' && editingMessageId !== chatdata.messageId) ? "sender" : "deletedmsg"} 
                ${(selectedMessageId === chatdata.messageId) ? "replymsg" : ""} 
                message-container`} 
                key={chatdata.messageId}
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
                {(chatdata.deleteSts=='No') ? <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}  {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                <p>
                    {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>You deleted your message. {moment(chatdata.timestamp).format('llll')}</span>  }
                                            
                    {((hoveredMessageId === chatdata.messageId) && chatdata.deleteSts=='No') && (
                        <span className="message-actions float-end ms-3">
                        <a
                            className="reply-button"
                            onClick={() => handleReplyClick(chatdata.messageId)}
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
                        </span>
                    )}
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'senderReplybox'} />
                {selectedMessageId === chatdata.messageId && (
                <span>
                    <InputEmoji
                    value={replyContent}
                    onChange={setReplyContent}
                    cleanOnEnter
                    onEnter={handleSaveEdit}
                    placeholder="Type a message"
                    shouldReturn
                    />
                    <button onClick={() => postReply(chatdata.messageId)}>Post Reply</button>
                    <button onClick={() => handleCancelReply(chatdata.messageId)}>Cancel</button>
                </span>
                )}
                </>
            )}
                </li>
            ) : (
                <li className={`${(chatdata.deleteSts=='No') ? "repaly" : "deletedmsg"}
                ${(selectedMessageId === chatdata.messageId) ? "replymsg" : ""}
                message-container`} 
                key={chatdata.messageId}
                onMouseEnter={() => handleMouseEnter(chatdata.messageId)}
                onClick={() => handleMouseEnter(chatdata.messageId)}
                onMouseLeave={handleMouseLeave}
                >
                {(chatdata.deleteSts=='No') ? <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                <p>
                    {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>{chatdata.senderName} deleted their own message. {moment(chatdata.timestamp).format('llll')}</span>  }
                    {((hoveredMessageId === chatdata.messageId) && chatdata.deleteSts=='No') && (
                        <span className="message-actions float-end ms-3">
                        <a
                            className="reply-button"
                            onClick={() => handleReplyClick(chatdata.messageId)}
                        >
                            <i className='fa fa-reply'></i>
                        </a>
                        </span>
                    )}
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'receiverReplybox'} />
                {selectedMessageId === chatdata.messageId && (
                <span>
                    <InputEmoji
                    value={replyContent}
                    onChange={setReplyContent}
                    cleanOnEnter
                    onEnter={handleSaveEdit}
                    placeholder="Type a message"
                    shouldReturn
                    />
                    <button onClick={() => postReply(chatdata.messageId)}>Post Reply</button>
                    <button onClick={() => handleCancelReply(chatdata.messageId)}>Cancel</button>
                </span>
                )}
                </li>
            )) : ( <b>TEST</b> )
            )}
            
            
            
            {messages.map((chatdata) =>
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className={`${(editingMessageId !== chatdata.messageId) ? "sender" : "deletedmsg"} message-container`}  
                key={chatdata.messageId}
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
                
                <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} />
                {hoveredMessageId === chatdata.messageId && (
                    <span className="message-actions float-end ms-3">
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
                    </span>
                )}
                </p>
                </>
                )}

                </li>
            ) : (
                <li className="repaly"  key={chatdata.messageId}>
                <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} /></p>
                </li>
            )
            )}
            </ul>
            <div className="message__status">
            <p>{typingStatusgroup}</p>
            </div>
             <div ref={lastMessageGroupRef} />
            </div>
            
        </div>
    </>
  )
}

export default Chatgroupbody