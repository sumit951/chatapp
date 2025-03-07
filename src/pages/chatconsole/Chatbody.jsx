import React from 'react'

const Chatbody = ({messages, lastMessageRef,typingStatus,chatdataFromChild }) => {
    
    //console.log(messages);
    if(!chatdataFromChild)
    {   console.log(chatdataFromChild);
        let chatdataFromChild = []
    }
    
  return (
    <>
        <div className="modal-body">
            <div className="msg-body">
            <ul>
            {chatdataFromChild.map((chatdata) =>
            (chatdata.messageId!=null) ? (
            chatdata.senderName === localStorage.getItem('loggedInUserName') ? (
                <li className="sender"  key={chatdata.messageId}>
                <p><strong>You</strong> : {chatdata.message}</p>
                </li>
            ) : (
                <li className="repaly"  key={chatdata.messageId}>
                <p><strong>{chatdata.senderName}</strong> : {chatdata.message}</p>
                </li>
            )) : ( <b>TEST</b> )
            )}
            {messages.map((chatdata) =>
            chatdata.name === localStorage.getItem('loggedInUserName') ? (
                <li className="sender"  key={chatdata.id}>
                <p><strong>You</strong> : {chatdata.message}</p>
                </li>
            ) : (
                <li className="repaly"  key={chatdata.id}>
                <p><strong>{chatdata.senderName}</strong> : {chatdata.message}</p>
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