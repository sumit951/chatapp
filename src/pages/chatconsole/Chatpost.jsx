import React, { useState, useEffect} from 'react'

const Chatpost = ({ socket,receiverId,senderUserData}) => {
    const [message, setMessage] = useState('');

    const handleRemoveTyping = () => {
        socket.emit('typing', '');
        //console.log(message);
    }

    const handleTyping = () => {
        socket.emit('typing', `${localStorage.getItem('loggedInUserName')} is typing . . .`);
        //console.log(message);
    }

    const handleSendMessage = (e) => {
        socket.emit('typing', '');
        e.preventDefault();
        if (message.trim() && localStorage.getItem('loggedInUserName'))
        {
            socket.emit('message', {
                message: message,
                senderName: localStorage.getItem('loggedInUserName'),
                /*id: `${socket.id}${Math.random()}`,*/
                senderId:senderUserData.id,
                socketID: socket.id,
                receiverId: receiverId,
                messageType:'text'
            });
        }
        setMessage('');
    };
    //console.log(senderUserData);
    
  return (
    <>
        <div className="send-box">
            <form onSubmit={handleSendMessage}>
                <input 
                    type="text"
                    className="form-control message" aria-label="message…" placeholder="Write message…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} 
                    onKeyDown={handleTyping}
                    onKeyUp={handleRemoveTyping}
                />
                <button ><i className="fa fa-paper-plane" aria-hidden="true"></i> Send</button>
            </form>

            {/* <div className="send-btns">
                <div className="attach">
                    <div className="button-wrapper">
                        <span className="label">
                            <img className="img-fluid" src="http://mehedihtml.com/chatbox/assets/img/upload.svg" alt="image title" /> attached file 
                        </span><input type="file" name="upload" id="upload" className="upload-box" placeholder="Upload File" aria-label="Upload File" />
                    </div>
                </div>
            </div> */}

        </div>
    </>
  )
}

export default Chatpost