import React from 'react'
import moment from 'moment'

const Chatbody = ({messages, lastMessageRef,typingStatus,chatdataFromChild }) => {
    
    //console.log(messages);
    //console.log(chatdataFromChild);
    
  return (
    <>
        <div className="modal-body">
            <div className="msg-body">
            <ul>
            {chatdataFromChild.map((chatdata) =>
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
            )) : ( <b></b> )
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

export default Chatbody