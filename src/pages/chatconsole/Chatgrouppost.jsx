import React, { useState, useEffect} from 'react'
import axiosConfig,{ BASE_URL } from '../../axiosConfig';
import InputEmoji from 'react-input-emoji'
import Chatfileupload from './Chatfileupload';

const Chatgrouppost = ({ socket,groupId,senderUserData,groupMemberdataFromChild}) => {

    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [filesblank, setfilesblank] = useState(false);

    const handleRemoveTyping = () => {
        socket.emit('typing', '');
        //console.log(message);
    }
    //console.log(groupId);
    const handleTyping = () => {
        //socket.emit('typing', `${localStorage.getItem('loggedInUserName')} is typing . . .`);
        socket.emit('typing', {"typingmessge":`${localStorage.getItem('loggedInUserName')} is typing . . .`,"groupId":groupId});
        //console.log(message);
    }

    const handleSendMessage = async (e) => {
        //console.log(groupId);
        socket.emit('typing', '');
        //e.preventDefault();
        const d = new Date();
        const formattedDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        if ((message.trim() || files.length) && localStorage.getItem('loggedInUserName'))
        {
            //console.log(message);
            if(files.length>0)
            {
                const formData = new FormData();
                formData.append("frmmessage", message);
                

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

                    await socket.emit('messagegroup', {
                        message: messagewithfiles,
                        senderName: localStorage.getItem('loggedInUserName'),
                       
                        senderId:senderUserData.id,
                        groupId:groupId,
                        socketID: socket.id,
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
                await socket.emit('messagegroup', {
                    message: message,
                    senderName: localStorage.getItem('loggedInUserName'),
                    /*id: `${socket.id}${Math.random()}`,*/
                    senderId:senderUserData.id,
                    groupId:groupId,
                    socketID: socket.id,
                    messageType:'text',
                    timestamp: formattedDate
                });
            }
        }
        setMessage('');
    };
    //console.log(senderUserData);
    
    const userforTag = groupMemberdataFromChild.filter(item => item.userId !== senderUserData.id);
    const mockUsers = 
            userforTag.map((user,i) => (
            {
            id: user.userId,
            name: user.userName,
            shortName: user.usershortName
            }
        ))
    ;
    
    
    /*const mockUsers = [
    {
        id: "2",
        name: "Rachel Marshall",
        image: "S"
        },
        {
        id: "3",
        name: "Bernice Patterson",
        image: "S"
        },
        {
        id: "4",
        name: "Sumit Kumar",
        image: "S"
        },
        {
        id: "5",
        name: "Arjun",
        image: "S"
        }
    ]*/
    
    //console.log(mockUsers);
        
    const searchMention = (message) => {
        if (!message) {
        return [];
        }

        const filteredText = message.substring(1).toLocaleLowerCase();

        return mockUsers.filter(user => {
        if (user.name.toLocaleLowerCase().startsWith(filteredText)) {
        return true;
        }

        const names = user.name.split(" ");

        return names.some(name =>
        name.toLocaleLowerCase().startsWith(filteredText)
        );
        });
    }  
    
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
            keepOpened
            disableRecent
            maxLength={1200}
            searchMention={searchMention}
            onBlur={() => {
                console.log('on blur')
            }}
            onFocus={() => {
                console.log('on focus')
            }}
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

export default Chatgrouppost