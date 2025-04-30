import React, { useState,useEffect }  from 'react'
import axiosConfig,{ BASE_URL } from '../../../axiosConfig';
import moment from 'moment'
import InputEmoji from 'react-input-emoji'
import Replies from './Repliesgroup';
import Pinnedhistory from './Pinnedhistory';

const Chatgroupbody = ({socket, messages, lastMessageGroupRef,typingStatusgroup,groupchatdataFromChild, onEditMessageGroup, onDeleteMsgGroup,newArrgroupchatdataFromChild,onReplyMessageGroup,onQuotedMessageGroup,messageRefsGroup,groupMemberdataFromChild,highlightIdGroup}) => {
    
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    //console.log(messages);
    //console.log(groupchatdataFromChild);
    const [groupchatdata, setgroupchatdata] = useState([]);
    useEffect(() => {
        
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
                <li className={`${(chatdata.deleteSts=='No') ? "sender" : "deletedmsg"} 
                
                message-container`} 
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefsGroup.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                >
                {(chatdata.deleteSts=='No') ? <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}  {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(chatdata.pinSts=='Yes') ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span>  : null}
                
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
                        {(chatdata.pinSts=='Yes') ? 'Unpin' : 'Pin'}
                        </a>
                        </span>
                    )}
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'senderReplybox'} messageRefsGroup={messageRefsGroup} onDeleteMsgGroup={onDeleteMsgGroup} onEditMessageGroup={onEditMessageGroup} groupMemberdataFromChild={groupMemberdataFromChild} highlightIdGroup={highlightIdGroup} />
                
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
               
                </li>
            ) : (
                <li className={`${(chatdata.deleteSts=='No') ? "repaly" : "deletedmsg"}
                
                message-container`} 
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefsGroup.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                >
                {(chatdata.deleteSts=='No') ? <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(chatdata.pinSts=='Yes') ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span> : null}
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
                        {(chatdata.pinSts=='Yes') ? 'Unpin' : 'Pin'}
                        </a>
                        </span>
                    )}
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'receiverReplybox'} messageRefsGroup={messageRefsGroup} onDeleteMsgGroup={onDeleteMsgGroup} onEditMessageGroup={onEditMessageGroup} groupMemberdataFromChild={groupMemberdataFromChild} highlightIdGroup={highlightIdGroup} />
                
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                </li>
            )) : ( <b>TEST</b> )
            )}
            
            
            
            {messages.map((chatdata) =>
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className={`sender message-container`}  
                    key={chatdata.messageId}
                    ref={(el) => {
                    if (el) messageRefsGroup.current[chatdata.messageId] = el;
                    }}
                    id={chatdata.messageId}
                >
                
                
                <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(chatdata.pinSts=='Yes') ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span>
                <p><span dangerouslySetInnerHTML={{__html: transformMessage(chatdata.message)}} />
               
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'senderReplybox'} messageRefsGroup={messageRefsGroup} onDeleteMsgGroup={onDeleteMsgGroup} onEditMessageGroup={onEditMessageGroup} groupMemberdataFromChild={groupMemberdataFromChild} highlightIdGroup={highlightIdGroup} />
                
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                

                </li>
            ) : (
                <li className={`${(chatdata.deleteSts=='No') ? "repaly" : "deletedmsg"}
                
                message-container`} 
                key={chatdata.messageId}
                ref={(el) => {
                if (el) messageRefsGroup.current[chatdata.messageId] = el;
                }}
                id={chatdata.messageId}
                >
                <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')} {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>} {(chatdata.pinSts=='Yes') ? <span> | <i className='fa fa-thumb-tack'></i></span>: null}</span>
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
                    {(chatdata.pinSts=='Yes') ? 'Unpin' : 'Pin'}
                    </a>
                    </span>
                )}
                </p>
                <Replies socket={socket} parentMessageId={chatdata.messageId} boxtype={'receiverReplybox'} messageRefsGroup={messageRefsGroup} onDeleteMsgGroup={onDeleteMsgGroup} onEditMessageGroup={onEditMessageGroup} groupMemberdataFromChild={groupMemberdataFromChild} highlightIdGroup={highlightIdGroup} />
                
                <Pinnedhistory socket={socket} parentMessageId={chatdata.messageId} />
                </li>
            )
            )}
            </ul>
            <div className="message__status">
            {/* <p>{typingStatusgroup}</p> */}
            </div>
            {highlightIdGroup===null && <div ref={lastMessageGroupRef} />}
            </div>
            
        </div>
    </>
  )
}

export default Chatgroupbody