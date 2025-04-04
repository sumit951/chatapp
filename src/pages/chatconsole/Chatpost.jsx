import React, { useState, useEffect} from 'react'
import axiosConfig,{ BASE_URL } from '../../axiosConfig';
import InputEmoji from 'react-input-emoji'
import Chatfileupload from './Chatfileupload';

const Chatpost = ({ socket,receiverId,senderUserData}) => {
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [filesblank, setfilesblank] = useState(false);

    const handleRemoveTyping = () => {
        socket.emit('typing', '');
        //console.log(message);
    }

    const handleTyping = () => {
        socket.emit('typing', {"typingmessge":`${localStorage.getItem('loggedInUserName')} is typing . . .`,"receiverId":senderUserData.id});
        //console.log(message);
    }
    
    const handleSendMessage = async (e) => {
        socket.emit('typing', '');
        //e.preventDefault();
        const d = new Date();
        const formattedDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        if ((message.trim() || files.length) && localStorage.getItem('loggedInUserName'))
        {
            if(files.length>0)
            {
                const formData = new FormData();
                formData.append("frmmessage", message);
                /*formData.append("senderName", localStorage.getItem('loggedInUserName'));
                formData.append("senderId", senderUserData.id);
                formData.append("receiverId", receiverId);
                formData.append("messageType", 'text');
                formData.append("timestamp", formattedDate);*/
                // Append files to form data
                /*files.forEach((file, index) => {
                formData.append(`file-${index}`, file);
                });*/

                // Append all files
                Array.from(files).forEach((file) => {
                    formData.append('files', file);
                });
                
                try {
                    const response = await axiosConfig.post(`/upload`,formData,{ headers: {
                        'Content-Type': 'multipart/form-data', // Set the default header to multipart/form-data
                      }})
                    //console.log(response);
                    //console.log(response.data['files']);
                    let filesStr = ''
                    response.data['files'].map((file) => {
                        //console.log(file);
                        filesStr += `<a key={${BASE_URL}/uploads/${file.filename}} href="${BASE_URL}/uploads/${file.filename}" target="_blank" rel="noopener noreferrer">${file.originalname}</a></br>`
                    });
                    const messagewithfiles = `${message}</br>${filesStr}`;

                    //console.log(messagewithfiles);

                    await socket.emit('message', {
                        message: messagewithfiles,
                        senderName: localStorage.getItem('loggedInUserName'),
                        senderId:senderUserData.id,
                        socketID: socket.id,
                        receiverId: receiverId,
                        messageType:'text',
                        timestamp: formattedDate
                    });

                    setfilesblank(true)
                    setFiles([]);
                    
                } catch (error) {
                    console.log(error.message);
                }

            }
            else
            {
                await socket.emit('message', {
                    message: message,
                    senderName: localStorage.getItem('loggedInUserName'),
                    senderId:senderUserData.id,
                    socketID: socket.id,
                    receiverId: receiverId,
                    messageType:'text',
                    timestamp: formattedDate
                });
            }    

        }
        setMessage('');
        setFiles([]);
    };
    //console.log(senderUserData);
    //console.log(filesblank);
    
  return (
    <>
        <div className="send-box">
        <Chatfileupload onFileSelect={setFiles} parentselectedFiles={filesblank} setfilesblank={setfilesblank} />
        <div className="float-end scutkey"><code>Shift + Enter</code> or <code>Ctrl + Enter</code> keyboard shortcut to create a new line.</div>
        <div className="clearfix"></div>
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