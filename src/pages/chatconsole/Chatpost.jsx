import React, { useState, useEffect} from 'react'
import InputEmoji from 'react-input-emoji'

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
        //e.preventDefault();
        const d = new Date();
        const formattedDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        if (message.trim() && localStorage.getItem('loggedInUserName'))
        {
            socket.emit('message', {
                message: message,
                senderName: localStorage.getItem('loggedInUserName'),
                /*id: `${socket.id}${Math.random()}`,*/
                senderId:senderUserData.id,
                socketID: socket.id,
                receiverId: receiverId,
                messageType:'text',
                timestamp: formattedDate
            });
        }
        setMessage('');
    };
    //console.log(senderUserData);
    
  return (
    <>
        <div className="send-box">
            <form>
            <InputEmoji
            value={message}
            onChange={setMessage}
            cleanOnEnter
            onEnter={handleSendMessage}
            onKeyDown={handleTyping}
            onKeyUp={handleRemoveTyping}
            placeholder="Type a message"
            shouldReturn
            />
                {/*<input 
                    type="text"
                    className="form-control message" aria-label="message…" placeholder="Write message…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} 
                    onKeyDown={handleTyping}
                    onKeyUp={handleRemoveTyping}
                />*/}
                <button type="button" className="send-box-button" onClick={handleSendMessage}><i className="fa fa-paper-plane" aria-hidden="true"></i>   </button>
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