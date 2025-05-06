import React, { useState, useEffect} from 'react'
import axiosConfig,{ BASE_URL } from '../../axiosConfig';
import InputEmoji from 'react-input-emoji'
import Chatfileupload from './Chatfileupload';
import { PulseLoader } from "react-spinners";

const Chatpost = ({ socket,receiverId,senderUserData, quotedMessage,inputpostmsgRef}) => {
    
    //console.log(quotedMessage);
    
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [filesblank, setfilesblank] = useState(false);
    const [image, setImage] = useState(null);
    const [quotedMessagePost, setQuotedMessagePost] = useState('');
    const [strPagequotedMessagePost, setStrPagequotedMessagePost] = useState('');
    const [postMsgLoader, setpostMsgLoader] = useState(false);
    
    useEffect( () => {
        setQuotedMessagePost(quotedMessage)
        if(quotedMessage.quoteMessage)
        {
            setStrPagequotedMessagePost(`<div class="quotedText"><p><b>${quotedMessage.sender}</b></p></br><p>${quotedMessage.quoteMessage}</p></div>`)
        }
    }, [quotedMessage]);

    const handleRemoveQuote = () => {
        setStrPagequotedMessagePost('');
        setQuotedMessagePost('');
    }

    const handleRemoveTyping = () => {
        socket.emit('typing', '');
        //console.log(message);
    }

    const handleTyping = () => {
        socket.emit('typing', {"typingmessge":`${localStorage.getItem('loggedInUserName')} is typing . . .`,"receiverId":senderUserData.id});
        //console.log(message);
    }
    
    const handleSendMessage = async (e) => {
        let strquotedMessagePost = '';
        if(quotedMessagePost)
        {
            strquotedMessagePost = `<div class="quotedText"><p><b>${quotedMessagePost.sender}</b></p></br><p>${quotedMessagePost.quoteMessage}</p></div>`
        }
       
        socket.emit('typing', '');
        //e.preventDefault();
        const d = new Date();
        const formattedDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        /* console.log(image);
        console.log(files);
        return false; */

        if ((message.trim() || files.length) && localStorage.getItem('loggedInUserName'))
        {
            if(files.length>0)
            {
                setpostMsgLoader(true)
                const formData = new FormData();
                formData.append("frmmessage", strquotedMessagePost+message);
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
                        console.log(file);
                        let originalnameFilename = file.originalname;
                        if(originalnameFilename == 'image.png')
                        {
                            originalnameFilename = `Screenshot_${file.filename}`;
                        }

                        if(file.mimetype =="image/png" || file.mimetype =="image/jpg" || file.mimetype =="image/jpeg" || file.mimetype =="image/gif" || file.mimetype =="image/PNG" || file.mimetype =="image/JPG" || file.mimetype =="image/JPEG" || file.mimetype =="image/GIF")
                        {
                            filesStr += `<a key={${BASE_URL}/uploads/${file.filename}} href="${BASE_URL}/uploads/${file.filename}" rel="noopener noreferrer" target="_blank"><img src="${BASE_URL}/uploads/${file.filename}" style=" width: 150px" /> </br>${originalnameFilename}</a></br>`
                        }
                        else
                        {
                            filesStr += `<a key={${BASE_URL}/uploads/${file.filename}} href="${BASE_URL}/uploads/${file.filename}" target="_blank" rel="noopener noreferrer">${originalnameFilename}</a></br>`
                        }
                    });
                    const messagewithfiles = `${strquotedMessagePost} ${message}</br>${filesStr}`;

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
                    setImage(null)
                    setpostMsgLoader(false)
                } catch (error) {
                    console.log(error.message);
                }

            }
            else
            {
                await socket.emit('message', {
                    message: strquotedMessagePost+message,
                    senderName: localStorage.getItem('loggedInUserName'),
                    senderId:senderUserData.id,
                    socketID: socket.id,
                    receiverId: receiverId,
                    messageType:'text',
                    timestamp: formattedDate
                });

                let toconsole = {
                    message: strquotedMessagePost+message,
                    senderName: localStorage.getItem('loggedInUserName'),
                    senderId:senderUserData.id,
                    socketID: socket.id,
                    receiverId: receiverId,
                    messageType:'text',
                    timestamp: formattedDate
                }
                //console.log(toconsole)
            }    

        }
        setQuotedMessagePost('')
        setStrPagequotedMessagePost('');
        setMessage('');
        setFiles([]);
        setImage(null)
    };

    const handlePaste = async (event) => {
        const items = event.clipboardData.items;
        const files = [];

        for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Check if the item is an image
        if (item.kind === "file" && item.type.startsWith("image")) {
            const file = item.getAsFile();
            files.push(file);
        }
        }

        if (files.length > 0) {
            setFiles((prevFiles) => [...prevFiles, ...files]); // Append pasted images to state
        }

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf('image') !== -1) {
            const blob = item.getAsFile();
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
            
            // Optionally, upload the image to the server here
            //await uploadImage(blob);
          }
        }
    };
    
    const handleRemoveFile = () => {
        setfilesblank(true)
        setFiles([]);
        setImage(null)
    };
    //console.log(senderUserData);
    //console.log(filesblank);
    //console.log(strPagequotedMessagePost);
  return (
    <>
        <div className="send-box">
        {postMsgLoader && <PulseLoader
        color="#e87a36"
        loading
        size={10}
        /> }
        <Chatfileupload onFileSelect={setFiles} parentselectedFiles={filesblank} setfilesblank={setfilesblank} />
        <div className="float-end scutkey"><code>Shift + Enter</code> or <code>Ctrl + Enter</code> keyboard shortcut to create a new line.</div>
        <div className="clearfix"></div>
        <div className='qm'>
        {quotedMessagePost && <span dangerouslySetInnerHTML={{__html: strPagequotedMessagePost}} />}
        {quotedMessagePost && <a className='badge badge-danger'><i class="fa fa-trash" onClick={handleRemoveQuote}></i></a> }</div>
        <div className="clearfix"></div>
            {image && 
            <div className="row file-preview">
       
                    <div className="file-preview-item">
                    <div className="col-md-11 chip-info"><img src={image} className="printscreen" alt="Pasted content" /></div>
                    <div>
                        <button type="button" className="btn xcross" onClick={handleRemoveFile}><i class="fa fa-close ms-1"></i></button>
                    </div>
                </div>
            </div>
            }
            <div className="clearfix"></div>

            <form>
            <div
            style={{
            border: '1px solid #ccc',
            padding: '10px',
            width: '100%',
            position: 'relative',
            }}
            onPaste={handlePaste}
            >
            <InputEmoji
            ref={inputpostmsgRef}
            value={message}
            onChange={setMessage}
            cleanOnEnter
            onEnter={handleSendMessage}
            onKeyDown={handleTyping}
            onKeyUp={handleRemoveTyping}
            onBlur={handleRemoveTyping}
            placeholder="Type a message"
            shouldReturn
            />
            </div>
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
        </div>
    </>
  )
}

export default Chatpost