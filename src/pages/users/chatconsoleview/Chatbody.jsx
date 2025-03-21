import React from 'react'
import moment from 'moment'

const Chatbody = ({lastMessageRef,chatdataFromChild,senderUserData}) => {
    
  return (
    <>
        <div className="modal-body">
            <div className="msg-body">
            <ul>
            {chatdataFromChild.map((chatdata) =>
            (chatdata.messageId!=null) ? (
            chatdata.senderName === senderUserData.name ? (
                <li className="sender"  key={chatdata.messageId}>
                                    <span className="time"><strong>{senderUserData.name}</strong> : {moment(chatdata.timestamp).format('llll')}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} /></p>
                </li>
            ) : (
                <li className="repaly"  key={chatdata.messageId}>
                                    <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} /></p>
                </li>
            )) : ( <b></b> )
            )}
            
            </ul>
            </div>
            <div ref={lastMessageRef} />
        </div>
    </>
  )
}

export default Chatbody