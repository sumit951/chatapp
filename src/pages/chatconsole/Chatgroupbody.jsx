import React from 'react'
import moment from 'moment'

const Chatgroupbody = ({messages, lastMessageGroupRef,typingStatus,groupchatdataFromChild }) => {
    
    //console.log(messages);
    //console.log(groupchatdataFromChild);
    
  return (
    <>
        <div className="modal-body">
            <div className="msg-body">
            <ul>
            {groupchatdataFromChild.map((chatdata) =>
            (chatdata.messageId!=null) ? (
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className="sender"  key={chatdata.messageId}>
                <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} /></p>
                </li>
            ) : (
                <li className="repaly"  key={chatdata.messageId}>
                <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} /></p>
                </li>
            )) : ( <b>TEST</b> )
            )}
            {messages.map((chatdata) =>
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className="sender"  key={chatdata.messageId}>
                <span className="time"><strong>You</strong> : {moment(chatdata.timestamp).format('llll')}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} /></p>
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
            <p>{typingStatus}</p>
            </div>
             <div ref={lastMessageGroupRef} />
            </div>
            
        </div>
    </>
  )
}

export default Chatgroupbody