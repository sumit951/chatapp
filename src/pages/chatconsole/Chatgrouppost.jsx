import React, { useState, useEffect} from 'react'
import axiosConfig,{ BASE_URL } from '../../axiosConfig';
import InputEmoji from 'react-input-emoji'
import Chatfileupload from './Chatfileupload';

const Chatgrouppost = ({ socket, groupId,senderUserData, groupMemberdataFromChild, quotedMessageGroup, inputpostmsgRefgroup}) => {

    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [filesblank, setfilesblank] = useState(false);
    const [image, setImage] = useState(null);
    const [quotedMessagePost, setQuotedMessagePost] = useState('');
    const [strPagequotedMessagePost, setStrPagequotedMessagePost] = useState('');
    
    const transformMessage = (message) => {
        // Regular expression to match mentions in the format @name(userId:number)
        const mentionRegex = /@\[([^\]]+)\](\(userId:(\d+)\))/g;
        
        // Replace mentions with <span> tags containing userId as data attribute
        return message.replace(mentionRegex, (match, userName, userTag, userId) => {
          return `&nbsp;<span class="tagg--text" data-userid="${userId}">@${userName}</span>&nbsp;`;
        });
    };

    useEffect( () => {
        setQuotedMessagePost(quotedMessageGroup)
        if(quotedMessageGroup.quoteMessage)
        {
            setStrPagequotedMessagePost(`<div class="quotedText"><p><b>${quotedMessageGroup.sender}</b></p></br><p>${quotedMessageGroup.quoteMessage}</p></div>`)
        }
    }, [quotedMessageGroup]);

    const handleRemoveQuote = () => {
        setStrPagequotedMessagePost('');
        setQuotedMessagePost('');
    }

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
        let strquotedMessagePost = '';
        if(quotedMessagePost)
        {
            strquotedMessagePost = `<div class="quotedText"><p><b>${quotedMessagePost.sender}</b></p></br><p>${quotedMessagePost.quoteMessage}</p></div>`
        }
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
                formData.append("frmmessage", strquotedMessagePost+transformMessage(message));
                

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
                        let originalnameFilename = file.originalname;
                        if(originalnameFilename == 'image.png')
                        {
                            originalnameFilename = `Screenshot_${file.filename}`;
                        }
                        filesStr += `<a key={${BASE_URL}/uploads/${file.filename}} href="${BASE_URL}/uploads/${file.filename}" target="_blank" rel="noopener noreferrer">${originalnameFilename}</a></br>`
                    });
                    const messagewithfiles = `${strquotedMessagePost} ${message}</br>${filesStr}`;

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
                    setImage(null)
                    
                } catch (error) {
                    console.log(error.message);
                }

            }
            else
            {
                await socket.emit('messagegroup', {
                    message: strquotedMessagePost+transformMessage(message),
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
        setQuotedMessagePost('')
        setStrPagequotedMessagePost('');
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
    ));
    
    
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
    
  return (
    <>
        <div className="send-box">
            <Chatfileupload onFileSelect={setFiles} parentselectedFiles={filesblank} setfilesblank={setfilesblank} />
            <div className="float-end scutkey"><code>Shift + Enter</code> or <code>Ctrl + Enter</code> keyboard shortcut to create a new line.</div>
            <div className="clearfix"></div>
            {image && <img src={image} className="printscreen" alt="Pasted content" />}
            <div className="clearfix"></div>
            {quotedMessagePost && <span dangerouslySetInnerHTML={{__html: strPagequotedMessagePost}} />}
            {quotedMessagePost && <a className='badge badge-danger'><i class="fa fa-trash" onClick={handleRemoveQuote}></i></a> }
            <div className="clearfix"></div>
            <form>
            <div
            style={{
            border: '1px solid #ccc',
            padding: '10px',
            width: '100%',
            overflow: 'auto',
            position: 'relative',
            }}
            onPaste={handlePaste}
            >
            <InputEmoji
            ref={inputpostmsgRefgroup}
            value={message}
            onChange={setMessage}
            cleanOnEnter
            onEnter={handleSendMessage}
            onKeyDown={handleTyping}
            onKeyUp={handleRemoveTyping}
            onBlur={handleRemoveTyping}
            placeholder="Type a message"
            keepOpened
            disableRecent
            maxLength={1200}
            searchMention={searchMention}
            onFocus={() => {
                console.log('on focus')
            }}
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