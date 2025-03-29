import React, { useState }  from 'react'
import moment from 'moment'

const Chatgroupbody = ({messages, lastMessageGroupRef,typingStatusgroup,groupchatdataFromChild, onEditMessageGroup, onDeleteMsgGroup,newArrgroupchatdataFromChild}) => {
    
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

    const handleEditClick = (message,messageId) => {
        setEditingMessage(message);
        setNewMessageText(message.text);
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
                <li className={`${(chatdata.deleteSts=='No' && editingMessageId !== chatdata.messageId) ? "sender" : "deletedmsg"} message-container`} 
                key={chatdata.messageId}
                onMouseEnter={() => handleMouseEnter(chatdata.messageId)}
                onClick={() => handleMouseEnter(chatdata.messageId)}
                onMouseLeave={handleMouseLeave}
                >
                {editingMessage && editingMessageId === chatdata.messageId ? (
              <>
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                />
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
                <li className={`${(chatdata.deleteSts=='No') ? "repaly" : "deletedmsg"} message-container`}  key={chatdata.messageId}>
                {(chatdata.deleteSts=='No') ? <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                <p>
                    {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : <span>{chatdata.senderName} deleted their own message. {moment(chatdata.timestamp).format('llll')}</span>  }
                </p>
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
                    <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    />
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