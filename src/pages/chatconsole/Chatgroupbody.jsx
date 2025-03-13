import React from 'react'
import moment from 'moment'

const Chatgroupbody = ({messages, lastMessageRef,typingStatus,groupchatdataFromChild }) => {
    
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
                <p><strong>You</strong> : {chatdata.message}</p>
                <span className="time">{moment(chatdata.timestamp).format('llll')}</span>
                </li>
            ) : (
                <li className="repaly"  key={chatdata.messageId}>
                <p><strong>{chatdata.senderName}</strong> : {chatdata.message}</p>
                <span className="time">{moment(chatdata.timestamp).format('llll')}</span>
                </li>
            )) : ( <b>TEST</b> )
            )}
            {messages.map((chatdata) =>
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className="sender"  key={chatdata.id}>
                <p><strong>You</strong> : {chatdata.message}</p>
                <span className="time">{moment(chatdata.timestamp).format('LT')}</span>
                </li>
            ) : (
                <li className="repaly"  key={chatdata.id}>
                <p><strong>{chatdata.senderName}</strong> : {chatdata.message}</p>
                <span className="time">{moment(chatdata.timestamp).format('LT')}</span>
                </li>
            )
            )}
            </ul>
            <div className="message__status">
            <p>{typingStatus}</p>
            </div>
                {/*<ul>
                    <li className="sender">
                        <p> Hey, Are you there? </p>
                        <span className="time">10:06 am</span>
                    </li>
                    <li className="sender">
                        <p> Hey, Are you there? </p>
                        <span className="time">10:16 am</span>
                    </li>
                    <li className="repaly">
                        <p>yes!</p>
                        <span className="time">10:20 am</span>
                    </li>
                    <li className="sender">
                        <p> Hey, Are you there? </p>
                        <span className="time">10:26 am</span>
                    </li>
                    <li className="sender">
                        <p> Hey, Are you there? </p>
                        <span className="time">10:32 am</span>
                    </li>
                    <li className="repaly">
                        <p>How are you?</p>
                        <span className="time">10:35 am</span>
                    </li>
                    <li>
                        <div className="divider">
                            <h6>Today</h6>
                        </div>
                    </li>

                    <li className="repaly">
                        <p> yes, tell me</p>
                        <span className="time">10:36 am</span>
                    </li>
                    <li className="repaly">
                        <p>yes... on it</p>
                        <span className="time">junt now</span>
                    </li>

                </ul>*/}
            </div>
            <div ref={lastMessageRef} />
        </div>
    </>
  )
}

export default Chatgroupbody