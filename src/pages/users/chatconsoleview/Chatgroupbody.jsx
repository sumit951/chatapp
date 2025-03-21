import React from 'react'
import moment from 'moment'

const Chatgroupbody = ({lastMessageGroupRef,groupchatdataFromChild,senderUserData }) => {
    //console.log(groupchatdataFromChild);
    
  return (
    <>
        <div className="modal-body">
            <div className="msg-body">
            <ul>
            {groupchatdataFromChild.map((chatdata) =>
            (chatdata.messageId!=null) ? (
            chatdata.senderName === senderUserData.name ? (
                <li className="sender"  key={chatdata.messageId}>
                <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} /></p>
                </li>
            ) : (
                <li className="repaly"  key={chatdata.messageId}>
                <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')}</span>
                <p><span dangerouslySetInnerHTML={{__html: chatdata.message}} /></p>
                </li>
            )) : ( <b>TEST</b> )
            )}
           
            </ul>
             <div ref={lastMessageGroupRef} />
            </div>
            
        </div>
    </>
  )
}

export default Chatgroupbody