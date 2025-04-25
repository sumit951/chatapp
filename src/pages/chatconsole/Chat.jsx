import React, { useState, useEffect, useRef, useMemo } from 'react'
import axiosConfig,{ BASE_URL } from '../../axiosConfig';

import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { Link, useNavigate, useParams } from 'react-router-dom';



import "../../assets/vendor/fontawesome/css/font-awesome.css";
import "../../assets/chat/style.css";
import "../../assets/chat/astyle.css";
import logo from '../../assets/rc.png';
import smallLogo from '../../assets/Raipd_logo.png';
import loaderImage from "../../assets/loader.gif";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff, faGear, faMessage, faPhone, faChevronRight  } from '@fortawesome/free-solid-svg-icons';


import userProfile from "../../assets/chat/user-profile.png";
import Chatnav from './Chatnav';
import Chatgroupcreate from './Chatgroupcreate';
import Chatbody from './Chatbody';
import Chatpost from './Chatpost';
import Chatgroupbody from './Chatgroupbody';
import Chatgrouppost from './Chatgrouppost';
import Chatgrouppeople from './Chatgrouppeople';
import Setting from './Setting';

import 'bootstrap/dist/css/bootstrap.min.css';
import Chatsearch from './Chatsearch';

const Chat = ({ socket }) => { 
    
    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    const loggedInUserName = localStorage.getItem('loggedInUserName')
    
    const logout = async () => {
        await localStorage.removeItem("chat-token-info");
        await localStorage.removeItem("loggedInUserName");
        await localStorage.removeItem("encryptdatatoken");
        navigate('/login')
        window.location.reload();
        //window.location.href = "/login";
    };

    const [userdataname, setUserdataname] = useState([]);
    const [usertypeData, setUserType] = useState([]);
    const [userData, setUserData] = useState([]);
    const [UserGroupInfo, setUserGroupInfo] = useState([]);
    const [selectedFrmUrl, setselectedFrmUrl] = useState();
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    
    /* const {boardid} = useParams()
    const {boardtype} = useParams()
    
    if(boardid!=null && boardtype!=null)
    {
        const boardIdDecode = atob(boardid)
        const boardTypeDecode = atob(boardtype)
        if(boardTypeDecode=='u')
        {
            //console.log(boardIdDecode+' '+boardTypeDecode);
        }
        
        useEffect(() => {
            setselectedFrmUrl(boardTypeDecode+boardIdDecode);
        }, [boardTypeDecode,boardIdDecode])
    } */
    const fetchUserInfo = async () => {
        try {
            const response = await axiosConfig.get('/auth/authenticate')
            if (response.status == 200) {
                if (response.status !== 200) {
                    navigate('/login')
                    window.location.reload();
                    //window.location.href = "/login";
                }
                setUserData(response.data[0]);
                setUserdataname(response.data[0].name);
                setUserType(response.data[0].userType);
            }
        } catch (error) {
            console.log(error.message);
            logout()
            navigate('/login')
        }
    }
    //console.log((userData.status));
    //return false;
    const userStatus = userData.status;
    useEffect(() => {
        if (!token) {
            navigate('/login')
            //window.location.href = "/login";
        }
        if (userStatus == 'Inactive') {
            //logout()
        }
        fetchUserInfo()
    }, [token,userStatus])

    const fetchusergroupinfo = async () => {
        try {
            const response = await axiosConfig.get('/user/getusergroupinfo')
            if (response.status == 200) {
                if (response.status !== 200) {
                    navigate('/login')
                    window.location.reload();
                    //window.location.href = "/login";
                }
                setUserGroupInfo(response.data[0]);
            }
        } catch (error) {
            console.log(error.message);
            logout()
            navigate('/login')
        }
    }
    
    //return false;
    useEffect(() => {
        if (userStatus == 'Active') {
        fetchusergroupinfo()
        }
    }, [userStatus])
    const groupCount = UserGroupInfo.groupCount;

    const [isNewmsgSender, setNewmsgSender] = useState([]);
    const [isNewmsgReceiver, setNewmsgReceiver] = useState([]);
    const [messages, setMessages] = useState([]);

    const [isNewmsgGroup, setNewmsgGroup] = useState([]);
    const [isNewmsgGroupSender, setNewmsgGroupSender] = useState([]);
    const [messagesgroup, setMessagesgroup] = useState([]);

    const [typingStatus, setTypingStatus] = useState('');
    const [typingStatusgroup, setTypingStatusgroup] = useState('');

    const lastMessageRef = useRef(null);
    const lastMessageGroupRef = useRef(null);
    const childLinkRef = useRef(null);

    const [dataFromChild, setDataFromChild] = useState("");
    const [chatdataFromChild, setChatDataFromChild] = useState([]);
    const [newArrchatdataFromChild, setnewChatDataFromChild] = useState([]);
    

    const [groupdataFromChild, setgroupDataFromChild] = useState("");
    const [groupchatdataFromChild, setGroupChatDataFromChild] = useState([]);
    const [newArrgroupchatdataFromChild, setnewgroupChatDataFromChild] = useState([]);

    const [groupMemberdataFromChild, setGroupMemberDataFromChild] = useState([]);

    
    const currentTime2 = new Date().getTime();
    const expiryTime = new Date(userData.chatBusyDndExpiredon).getTime() + 60000; // expiry time in milliseconds (60 seconds)
    
    let notificationEnbleSts = true;  
    if ((currentTime2 <= expiryTime) && userData.chatStatus=='DND') {
        //console.log(userData.chatStatus);
        notificationEnbleSts = false;
    }
    else 
    {
        if(userData.chatStatus=='Busy' || userData.chatStatus=='DND')
        {
            try {
                //console.log(id);
    
                const response = axiosConfig.put(`/user/updatesettingtoactive`)
                console.log(response);
                
                
            } catch (error) {
                //console.log(error.message);
                
            }
        }
    }
    
    useEffect(() => {
        //lastMessageRef.current?.scrollIntoView({ block: "end"});
    }, [messages]);
    lastMessageRef.current?.scrollIntoView({ block: "end"});

    useEffect(() => {
        //lastMessageGroupRef.current?.scrollIntoView({ block: "end"});
    }, [messages]);
    lastMessageGroupRef.current?.scrollIntoView({ block: "end"});
    
    const [foundTaggedUser, setFoundTaggedUser] = useState(false);


    

    useEffect(() => {
        socket.on('messageResponse', (data) => { 
            //console.log(data);
            //console.log(isTabActive);
            //console.log(notificationShown);            

            /* if(!isTabActive && !notificationShown && data.receiverId == chatboardUserid)
            { 
                if(notificationEnbleSts)
                {
                    showNotification(data);
                }
                setNotificationShown(true); // Ensure notification shows only once
                setIsTabActive(true);
            } */
            
            //console.log(document.visibilityState);
            
            /* const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    setIsTabActive(true);
                } else {
                    setIsTabActive(false);
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange); */
            setMessages([...messages, data])
            setNewmsgSender([...isNewmsgSender,data.senderId])
            setNewmsgReceiver(data.receiverId)
            fetchinteractwithuserlist()
            fetchinteractwithuserlistfavourite()
        })
    }, [socket, messages,loggedInUserName]);

    useEffect(() => {
        socket.on('messagegroupResponse', (data) => {
            setMessagesgroup([...messagesgroup, data])
            setNewmsgGroupSender([...isNewmsgGroupSender,data.groupId])
            setNewmsgGroup(data.senderId)
            //console.log(data.groupId+"---"+data.senderId);

            
            const isFound = data.message.includes(`@${loggedInUserName}`);
            /* console.log(data.message);
            console.log(isFound);
            console.log(`@${loggedInUserName}`); */
            setFoundTaggedUser(isFound);
            
        })
    }, [socket, messagesgroup]);

    socket.on('updatedMessage', (updatedMsg) => {
        const newMessages = messages.map((item) =>
            item.messageId === updatedMsg.messageId
              ? { ...item, editSts: 'Yes',message: updatedMsg.newMessage }
              : item
        );
        setMessages(newMessages);

        const newchatdataFromChild = chatdataFromChild.map((item) =>
            item.messageId === updatedMsg.messageId
              ? { ...item, editSts: 'Yes',message: updatedMsg.newMessage }
              : item
        );
        setnewChatDataFromChild(newchatdataFromChild)
        //console.log(newchatdataFromChild);
        
    });
    
    socket.on('updatedMessageGroup',async(updatedMsg) => {
        const newMessagesgroup = messagesgroup.map((item) =>
            item.messageId === updatedMsg.messageId
              ? { ...item, editSts: 'Yes',message: updatedMsg.newMessage }
              : item
        );
        setMessagesgroup(newMessagesgroup);

        const newgroupchatdataFromChild = groupchatdataFromChild.map((itemgroup) =>
            itemgroup.messageId === updatedMsg.messageId
              ? { ...itemgroup, editSts: 'Yes',message: updatedMsg.newMessage }
              : itemgroup
        );
        setnewgroupChatDataFromChild(newgroupchatdataFromChild)
    });
    //console.log(messages);
    
    const receiverId = dataFromChild.selectedUserId;
    const favouriteStatus = dataFromChild.favouriteStatus

    const groupId = groupdataFromChild.selectedUserId;
    const createdBy = groupdataFromChild.createdBy;
    const loggedInuserId = userData.id;
    const favouriteStatusGroup = groupdataFromChild.favouriteStatusGroup;
    //console.log(createdBy+''+loggedInuserId);
    //console.log(dataFromChild.favouriteStatus);
    
    let userboard = false;
    let groupboard = false;
    if (dataFromChild.userboard) {
        groupdataFromChild.groupboard = false;
        userboard = dataFromChild.userboard;
    }

    if (groupdataFromChild.groupboard) {
        dataFromChild.userboard = false;
        groupboard = groupdataFromChild.groupboard;
    }

    //console.log(userboard+' '+groupboard);
    
    
    const messageResponse = messages.filter(item => (((item.receiverId === userData.id) || (item.senderId === userData.id)) && ((item.receiverId === receiverId) || (item.senderId === receiverId))))


    const messagegroupResponse = messagesgroup.filter(item => (item.groupId === groupId))


    const handleEditMessage = async (updatedMessageDate) => {
        //console.log(updatedMessageDate);
        try {
            //console.log(id);
            if(!confirm('Please Conifrm')) return false;

            const response = await axiosConfig.put(`/chat/updatesetaseditedmessage`,updatedMessageDate)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                } 
                /* toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                }); */
                setTimeout(() => {
                    socket.emit('editMessage', updatedMessageDate);
                    //const newchatdataFromChild = chatdataFromChild.filter((items) => items.messageId !== id)
                    const newchatdataFromChild = chatdataFromChild.map((item) =>
                        item.messageId === updatedMessageDate.messageId
                          ? { ...item, editSts: 'Yes',message: updatedMessageDate.newMessage }
                          : item
                    );
                    
                    setnewChatDataFromChild(newchatdataFromChild)
                    //console.log(newchatdataFromChild)
                    setMessages([])
                    }, 500
                );
            }
        } catch (error) {
            //console.log(error.message);
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true
            });
        }
    };

    
    const deleteMessage = async (id) => {
        try {
            //console.log(id);
            if(!confirm('Please Conifrm')) return false;

            const encodeMessageId = btoa(id)

            const response = await axiosConfig.put(`/chat/setasdeletemessage/${encodeMessageId}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                } 
                /* toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                }); */
                const postData = {messageId:id}
                socket.emit('deleteMessage', postData);
                setTimeout(() => {
                    //const newchatdataFromChild = chatdataFromChild.filter((items) => items.messageId !== id)
                    const newchatdataFromChild = chatdataFromChild.map((item) =>
                        item.messageId === id
                          ? { ...item, deleteSts: 'Yes' }
                          : item
                      );
                    
                    setnewChatDataFromChild(newchatdataFromChild)
                    //console.log(newchatdataFromChild)
                    setMessages([])
                    }, 500
                );
            }
        } catch (error) {
            //console.log(error.message);
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true
            });
        }
    };


    const handleReplyMessage = async (replyMessageData) => {
        /* console.log(replyMessageData.messageId);
        return false */
        const d = new Date();
        const formattedDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        if ((replyMessageData.newMessage.trim() || files.length) && localStorage.getItem('loggedInUserName'))
        {
            /* if(files!=null && files.length>0)
            {
                const formData = new FormData();
                formData.append("frmmessage", replyMessageData.newMessage);
                // Append files to form data
                

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
                    const messagewithfiles = `${replyMessageData.newMessage}</br>${filesStr}`;

                    //console.log(messagewithfiles);

                    await socket.emit('replyMessage', {
                        message: messagewithfiles,
                        senderName: localStorage.getItem('loggedInUserName'),
                        senderId:userData.id,
                        socketID: socket.id,
                        receiverId: receiverId,
                        messageType:'text',
                        timestamp: formattedDate,
                        replyTo:replyMessageData.messageId
                    });

                    setfilesblank(true)
                    setFiles([]);
                    
                } catch (error) {
                    console.log(error.message);
                }

            }
            else
            { */
                await socket.emit('replyMessage', {
                    message: replyMessageData.newMessage,
                    senderName: localStorage.getItem('loggedInUserName'),
                    senderId:userData.id,
                    socketID: socket.id,
                    receiverId: receiverId,
                    messageType:'text',
                    timestamp: formattedDate,
                    replyTo:replyMessageData.messageId
                });
            /* } */    

        }
    };

    const [quotedMessage, setQuotedMessage] = useState('');
    const handleQuotedMessage = async (quotedMessageData) => {
        //console.log(quotedMessageData);
        setQuotedMessage(quotedMessageData)
    };
    
    const [quotedMessageGroup, setQuotedMessageGroup] = useState('');
    const handleQuotedMessageGroup = async (quotedMessageDataGroup) => {
        //console.log(quotedMessageDataGroup);
        setQuotedMessageGroup(quotedMessageDataGroup)
    };

    const handleReplyMessageGroup = async (replyMessageData) => {
        /* console.log(replyMessageData.messageId);
        return false */
        const d = new Date();
        const formattedDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        if ((replyMessageData.newMessage.trim() || files.length) && localStorage.getItem('loggedInUserName'))
        {
            /* if(files.length>0)
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
            { */
                await socket.emit('replyMessageGroup', {
                    message: replyMessageData.newMessage,
                    senderName: localStorage.getItem('loggedInUserName'),
                    /*id: `${socket.id}${Math.random()}`,*/
                    senderId:userData.id,
                    groupId:groupId,
                    socketID: socket.id,
                    messageType:'text',
                    timestamp: formattedDate,
                    replyTo:replyMessageData.messageId
                });
            /* } */    

        }
    };

    const handleEditMessageGroup = async (updatedMessageDate) => {
        //console.log(updatedMessageDate);
        try {
            //console.log(id);
            if(!confirm('Please Conifrm')) return false;

            const response = await axiosConfig.put(`/chat/updatesetaseditedmessage`,updatedMessageDate)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                } 
                /* toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                }); */
                setTimeout(() => {
                    socket.emit('editMessageGroup', updatedMessageDate);
                    //const newchatdataFromChild = chatdataFromChild.filter((items) => items.messageId !== id)
                    const newgroupchatdataFromChild = groupchatdataFromChild.map((item) =>
                        item.messageId === updatedMessageDate.messageId
                          ? { ...item, editSts: 'Yes',message: updatedMessageDate.newMessage }
                          : item
                    );
                    
                    setnewgroupChatDataFromChild(newgroupchatdataFromChild)
                    //console.log(newchatdataFromChild)
                    setMessages([])
                    }, 500
                );
            }
        } catch (error) {
            //console.log(error.message);
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true
            });
        }
    };

    
    const deleteMessageMsgGroup = async (groupmsgid) => {
        try {
            //console.log(id);
            if(!confirm('Please Conifrm')) return false;

            const encodeMessageId = btoa(groupmsgid)

            const response = await axiosConfig.put(`/chat/setasdeletemessage/${encodeMessageId}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                } 

                /* toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                }); */

                const postData = {messageId:groupmsgid}
                socket.emit('deleteMessage', postData);

                setTimeout(() => {
                    //const newgroupchatdataFromChild = groupchatdataFromChild.filter((items) => items.messageId !== groupmsgid)
                    const newgroupchatdataFromChild = groupchatdataFromChild.map((item) =>
                        item.messageId === groupmsgid
                          ? { ...item, deleteSts: 'Yes' }
                          : item
                      );
                    setnewgroupChatDataFromChild(newgroupchatdataFromChild)
                    //console.log(newchatdataFromChild)
                    setMessagesgroup([])
                    }, 500
                );
            }
        } catch (error) {
            //console.log(error.message);
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true
            });
        }
    };

    useEffect(() => {
        socket.on('typingResponse', (data) => {
            //console.log(data.groupId+'-'+groupId);
            
            if(receiverId === data.receiverId)
            {
                //setTypingStatus(data.typingmessge)
                //setTypingStatusgroup('')
            }
            
            if(groupId === data.groupId)
            {
                //setTypingStatusgroup(data.typingmessge)
                //setTypingStatus('')
            }
        })
        socket.on('reloadChatStatus', (data) => {
            console.log(data);
            if(data!="")
            {
                fetchinteractwithuserlist()
                fetchinteractwithuserlistfavourite()
            }
        })

        /* socket.on('reloadpinStatusUpdated', async (data) => {
            console.log(data);
            try {
                const encodeGroupId = btoa(data.groupId)
                const response = await axiosConfig.get(`/chat/getgroupchat/${encodeGroupId}`)
                if(response.status==200)
                {
                    //const token = localStorage.getItem(token)
                    if(response.status !== 200)
                    {
                        navigate('/login')
                    }   
                    
                }
                //console.log(response.data);
                
                setGroupChatDataFromChild(response.data);
            } catch (error) {
                console.log(error.message);
                
            }
        }) */
    }, [socket,receiverId,groupId]);

    const [groupComponenet, SetGroupcomponent] = useState(false)
    const handleCreateGroup = async () => {
        SetGroupcomponent(true)
        SetonetoOnecomponent(false)
        Setusersetting(false)
    }

    const [onetoOneComponenet, SetonetoOnecomponent] = useState(false)
    const handleDirectGroup = async () => {
        SetonetoOnecomponent(true)
        SetGroupcomponent(false)
        Setusersetting(false)
    }

    const [usersetting, Setusersetting] = useState(false)
    const handleUsersetting = async () => {
        SetonetoOnecomponent(false)
        SetGroupcomponent(false)
        Setusersetting(true)
    }
    //console.log(groupComponenet);
    
    const [activefrParent, setActivefrParent] = useState(null);
    const handleDataFromChild = (data, userChatData, groupdata, groupChatData,groupMemberData) => {
        if(data)
        {
            setDataFromChild(data)
        }
        if(userChatData)
        {
            setChatDataFromChild(userChatData)
        }
        if(groupdata)
        {
            setgroupDataFromChild(groupdata)
        }
        if(groupChatData)
        {
            setGroupChatDataFromChild(groupChatData)
        }
        if(groupMemberData)
        {
            setGroupMemberDataFromChild(groupMemberData)
        }        
    }
    
    
    const handleDeleteGroup = async(id) =>{
        try {
            //console.log(id);
            if(!confirm('Please Conifrm')) return false;
            const encodeGroupId = btoa(id)
            const response = await axiosConfig.delete(`/chat/deletegroup/${encodeGroupId}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                } 
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                });
                setTimeout(() => {
                    //navigate('/manageuser');
                    location.reload()
                    }, 2000
                );
            }
        } catch (error) {
            //console.log(error.message);
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true
            });
        }  
    }

    const handleLeaveSpace = async(groupId,userId,totalMember) =>{
        try {
            //console.log(id);
            if(!confirm('Please Conifrm')) return false;

            const encodeGroupId = btoa(groupId)
            const encodeUserId = btoa(userId)
            const encodetotalMember = btoa(totalMember)

            const response = await axiosConfig.delete(`/chat/leavegroupspace/${encodeUserId}/${encodeGroupId}/${encodetotalMember}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                } 
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                });
                setTimeout(() => {
                    //navigate('/manageuser');
                    location.reload()
                    }, 2000
                );
            }
        } catch (error) {
            //console.log(error.message);
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true
            });
        }  
    }


    
    const [interactwithuserlist, setInteractwithuserlist] = useState([]);
    
    const fetchinteractwithuserlist = async () => {
    try {
   
            const encodeSelectedUserId = btoa(chatboardUserid)
            const response = await axiosConfig.get(`/chat/getinteractwithuserlist/${encodeSelectedUserId}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                }   
                setInteractwithuserlist(response.data);
            }
            else
            {
                setInteractwithuserlist([])
            }
        } catch (error) {
        console.log(error.message);
        setInteractwithuserlist([])
        }    
        
    }

    const [interactwithuserlistfavourite, setInteractwithuserlistfavourite] = useState([]);
    
    const fetchinteractwithuserlistfavourite = async () => {
    try {
   
            const encodeSelectedUserId = btoa(chatboardUserid)
            const response = await axiosConfig.get(`/chat/getinteractwithuserlistfavourite/${encodeSelectedUserId}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                }   
                setInteractwithuserlistfavourite(response.data);
            }
            else
            {
                setInteractwithuserlistfavourite([])
            }
        } catch (error) {
        console.log(error.message);
        setInteractwithuserlistfavourite([])
        }    
        
    }
   
    useEffect(() => {
        fetchinteractwithuserlist()
        fetchinteractwithuserlistfavourite()
        /* socket.on('messageResponse', (data) => { 
            fetchinteractwithuserlist()
        }) */
        
    }, [socket])

    const [alluserdata, setAllUserdata] = useState([]);

    const [searchParam, setSearchuser] = useState();
    //console.log(searchParam);
    
    const fetchAllUser = async () => {
    try {
        if(searchParam!=null)
        {
            const response = await axiosConfig.get(`/user/getactiveallusergroup/${searchParam}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                }   
                setAllUserdata(response.data);
            
            }
        }
        } catch (error) {
        console.log(error.message);
        
        }    
        
    }
    //console.log(alluserdata);
    useEffect(() => {
        if(!token)
        {
            navigate('/login')
            //window.location.href = "/login";
        }
        fetchAllUser()
    }, [token])

    const newUserslisting1 = alluserdata.filter(item => item.userId !== chatboardUserid);
    //console.log(alluserdata);
    
    const options = newUserslisting1.map((datauser) => (
        { value: datauser.userId, label: datauser.userName}
    ))

    const [selOption, setSelOption] = useState(['']);
    const HandNewUserChat = (obj) => {
        setSelOption(obj)    
        
        if(obj['selectUsers'].value!=null)
        {
            let selectedUserFrchatName = obj['selectUsers'].label.split(' ')
            let selectedUserFrchatId   = obj['selectUsers'].value
            const selectedUserFrchat = {"userId":obj['selectUsers'].value,"userName":selectedUserFrchatName[0],"usershortName":obj['selectUsers'].label[0]}
            const containsObject = interactwithuserlist.some((item) => item.userId === selectedUserFrchatId);
            
            if (!containsObject && (selectedUserFrchatId != chatboardUserid)) {
                //interactwithuserlist.push(selectedUserFrchat);
                interactwithuserlist.unshift(selectedUserFrchat);

                //let newselectedFrmUrl = btoa('A-tab')+'/'+btoa(selectedUserFrchat.userId);
                let newselectedFrmUrl = 'A-tab'+selectedUserFrchat.userId;
                setselectedFrmUrl(newselectedFrmUrl);
                setActivefrParent(selectedUserFrchatName[0].trim())
                if (childLinkRef.current) {
                childLinkRef.current.click(); // Trigger click on the child <a> tag
                //alert()
                }
                SetonetoOnecomponent(false)
                //navigate(`/chatconsole/spaces/${newselectedFrmUrl}`)
            }
        }
    };

    const [pinnedMessagesData, setpinnedMessagesData] = useState([]);
    const handlepinnedMessages = async (senderId,receiverId) => {
        //console.log(senderId+'---'+receiverId);
       
        if (senderId && receiverId && localStorage.getItem('loggedInUserName'))
        {
            try {
                const postData = {senderId:senderId,receiverId:receiverId}
                //console.log(postData);
                
                const response = await axiosConfig.post(`/chat/pinnedmessagesdata`, postData)
                if(response.status==200)
                {
                    if(response.status !== 200)
                    {
                        navigate('/login')
                    }   
                    
                }
                console.log(response.data);
                setpinnedMessagesData(response.data);
                
            } catch (error) {
                console.log(error.message);
            }

        
                

        }
    };
    
    useEffect(() => {
        setTimeout(() => {
            socket.on('reloadpinStatusUpdated', (data) => { 
                handlepinnedMessages(chatboardUserid,receiverId)
                //alert('hi');
            })
        }, 1000);
        
    }, [socket,chatboardUserid,receiverId]);


    const [pinnedMessagesDataGroup, setpinnedMessagesDataGroup] = useState([]);
    const handlepinnedMessagesGroup = async (senderId,groupId) => {
        //console.log(senderId+'---'+receiverId);
       
        if (senderId && groupId && localStorage.getItem('loggedInUserName'))
        {
            try {
                const postData = {senderId:senderId,groupId:groupId}
                //console.log(postData);
                
                const response = await axiosConfig.post(`/chat/pinnedmessagesgroupdata`, postData)
                if(response.status==200)
                {
                    if(response.status !== 200)
                    {
                        navigate('/login')
                    }   
                    
                }
                console.log(response.data);
                setpinnedMessagesDataGroup(response.data);
                
            } catch (error) {
                console.log(error.message);
            }
        }
    };
    
    useEffect(() => {
        setTimeout(() => {
            socket.on('reloadpinStatusUpdated', (data) => { 
                handlepinnedMessagesGroup(chatboardUserid,groupId)
            })
        }, 1000);
        
    }, [socket,chatboardUserid,groupId]);

    const [sidebarClosed, setSidebarClosed] = useState(false);

    // Toggle sidebar function
    const toggleSidebar = () => {
      setSidebarClosed(!sidebarClosed);
    };

    const handleMessageTab = () => {
        navigate('/chatconsole/spaces')
        location.reload()
    }
    
    /*One to one Message Search*/
    const [searchbox, setsearchbox] = useState(false)
    const [searchTerm, setSearchTerm] = useState(null);

    const handlesearchbox = (e) => {
        setsearchbox(true);
    }
    
    const cancelsearchbox = (e) => {
        setsearchbox(false);
        setSearchTerm('')
    }

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const messageRefs = useRef({}); // store refs in an object keyed by message id or index
    const [highlightId, setHighlightId] = useState(null); // id or index of the message to focus
    
    const handleFocusMessage = async (id) => {
        setHighlightId(id);

        const nodemsg = messageRefs.current[id];        
        if (nodemsg) {
            nodemsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nodemsg.classList.add('highlight'); // for styling
            setTimeout(() => {
                nodemsg.classList.remove('highlight');
            }, 10000);
        }
    };

    /*One to one Message Search*/

    /*Group Message Search*/
    const [searchboxGroup, setsearchboxGroup] = useState(false)
    const [searchTermGroup, setSearchTermGroup] = useState(null);

    const handlesearchboxGroup = (e) => {
        setsearchboxGroup(true);
    }
    
    const cancelsearchboxGroup = (e) => {
        setsearchboxGroup(false);
        setSearchTermGroup('')
    }

    const handleInputChangeGroup = (e) => {
        setSearchTermGroup(e.target.value);
    };

    const messageRefsGroup = useRef({}); // store refs in an object keyed by message id or index
    const [highlightIdGroup, setHighlightIdGroup] = useState(null); // id or index of the message to focus

    const handleFocusMessageGroup = (id) => {
        setHighlightIdGroup(id);

        const nodemsgGroup = messageRefsGroup.current[id];        
        if (nodemsgGroup) {
            nodemsgGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nodemsgGroup.classList.add('highlight'); // for styling
            setTimeout(() => {
                nodemsgGroup.classList.remove('highlight');
            }, 10000);
        }
    };
    /*Group Message Search*/
    
    const [reloadGrouplist, setreloadGrouplist] = useState(false); // id or index of the message to focus
    const handleCreatedGroupData = (groupid) => {
        console.log(groupid);
        setreloadGrouplist(true)
        let groupkeyId = 'AG-tab'+groupid;
        setselectedFrmUrl(groupkeyId);
    };

    const handleSendRequestCreateGRP = async () => {
        //console.log(senderId+'---'+receiverId);
       
        if (confirm('Please Confirm !'))
        {
            try {
                const response = await axiosConfig.post(`/user/sendaddSingleuserreq`)
                if(response.status==200)
                {
                    if(response.status==200 && response.data.status=='success')
                    {
                    socket.emit('sendaddmemberrequest', response.data);
                    toast.success(response.data.message, {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: true
                    });
                }  
                if(response.data.status=='fail')
                {
                    toast.error(response.data.message, {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: true
                    });
                }   
                }
                
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    const [favouriteUser, setFavouriteUser] = useState(false);
    const handleFavourite = async (actType,receiverId,favouriteUser) => {
        //console.log(actType+'---'+receiverId);
        if (receiverId && localStorage.getItem('loggedInUserName'))
        {
            setFavouriteUser(!favouriteUser)
            try {
                const postData = {receiverId:receiverId,actType:actType}
                
                const response = await axiosConfig.post(`/chat/updatefavouritestatus`, postData)
                if(response.status==200)
                {
                    if(response.status !== 200)
                    {
                        navigate('/login')
                    }   
                    
                }
                //console.log(response.data);
                fetchinteractwithuserlist()
                fetchinteractwithuserlistfavourite()
                
            } catch (error) {
                console.log(error.message);
            }
        }
    
    };
    

    const [favouriteGroup, setFavouriteGroup] = useState(false);
    const handleFavouriteGroup = async (actType,groupId,favouriteGroup) => {
        //console.log(actType+'---'+receiverId);
        if (groupId && localStorage.getItem('loggedInUserName'))
        {
            setFavouriteGroup(!favouriteGroup)
            try {
                const postData = {groupId:groupId,actType:actType}
                
                const response = await axiosConfig.post(`/chat/updatefavouritestatusgroup`, postData)
                if(response.status==200)
                {
                    if(response.status !== 200)
                    {
                        navigate('/login')
                    }   
                    
                }
                //console.log(response.data);
                setreloadGrouplist(true)
                
            } catch (error) {
                console.log(error.message);
            }
        }
    
    };
    
    const inputpostmsgRef = useRef(null);
    const inputpostmsgRefgroup = useRef(null);
    useEffect(() => {
        setFavouriteUser(favouriteStatus)
        setFavouriteGroup(favouriteStatusGroup)
        if(receiverId)
        {
            inputpostmsgRef.current?.focus();
        }
        if(groupId)
        {
            inputpostmsgRefgroup.current?.focus();
        }
    }, [receiverId,groupId,favouriteStatus,favouriteStatusGroup])
    return (
        <div>
            <section className="message-area">
                {/* <div className="container"> */}
                    <div className="row">
                        <div className="col-12">

                            <div id="header">
                                {/* <div className="color-line">
                                </div> */}
                                <div className="row mx-2">
                                    <div className="col-3">

                                        <div id="logo" className="light-version">
                                            {usertypeData == 'EMPLOYEE' ? (
                                                <div className='logoimg'><img src={logo} alt="Logo" /> </div>
                                            ) : (
                                                <Link to="/">
                                                    <div className='logoimg'><img src={logo} alt="Logo" /> </div>
                                                </Link>
                                            )
                                            }

                                        </div>
                                    </div>
                                    <div className="col-4 sharparrow">
                                        
                                        {onetoOneComponenet &&
                                            
                                            <Select 
                                                isClearable
                                                isSearchable
                                                onChange={(option) => HandNewUserChat({selectUsers:option})}
                                                onKeyDown={(e) => fetchAllUser(setSearchuser(e.target.value))}
                                                components={animatedComponents}
                                                options={options} />
                                                
                                        }
                                    </div>
                                    <div className="col-1 sharparrow">
                                        <ul className="moreoption">
                                            <li className="navbar nav-item dropdown">
                                                <a className="nav-link dropdown-toggle plua" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-plus"></i></a>
                                                <ul className="dropdown-menu">
                                                    <li><a className="dropdown-item" onClick={handleDirectGroup}>Direct Chat</a></li>
                                                    {((groupCount<userData.allowedInGroups) || usertypeData != 'EMPLOYEE') && <li><a className="dropdown-item" onClick={handleCreateGroup}>Create Group</a></li>}
                                                    {(groupCount>=userData.allowedInGroups) && usertypeData == 'EMPLOYEE' && <li><a className="dropdown-item" onClick={handleSendRequestCreateGRP}>Send Request to Create Group</a></li>}
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-4 sharparrow">
                                        <div className='float-end'>
                                            <ul className="moreoption">
                                                <li className="navbar nav-item dropdown">
                                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><span> <FontAwesomeIcon icon={faUser} size="1x" /> Welcome | {userdataname} </span> <i className="fa fa-ellipsis-v" aria-hidden="true"></i></a>
                                                    <ul className="dropdown-menu lc">
                                                        {usertypeData != 'EMPLOYEE' ? (
                                                            <li><Link to="/"></Link></li>
                                                        ) : (
                                                            null
                                                        )
                                                        }
                                                        <li> <a className="dropdown-item" onClick={logout}><FontAwesomeIcon icon={faPowerOff} size="1x" /> LEAVE CHAT</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">

                            <div className="chat-area">
                            <div className='sidebarr'>
      {/* Sidebar */}
      {/* <nav className={`sidebarss ${sidebarClosed ? 'close' : ''}`}>
        <header>
          <span className="image">
            <FontAwesomeIcon 
              icon={faChevronRight} 
              size="sm"
              className={`toggle ${sidebarClosed ? 'rotate' : ''}`}
              onClick={toggleSidebar}
            />
          </span>
        </header>

        <div className="menu-bar">
          <ul className="menu-links">
            <li className="nav-link">
            <a href="javascript:void(0);" onClick={handleMessageTab}>
              <FontAwesomeIcon icon={faMessage} />
                <span className="text nav-text">Message</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="javascript:void(0);">
              <FontAwesomeIcon icon={faPhone} />
                <span className="text nav-text">Calling</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="javascript:void(0);" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <FontAwesomeIcon icon={faGear} />
                <span className="text nav-text">Setting</span>
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="javascript:void(0);" onClick={handleUsersetting}>Busy / DND </a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav> */}
    </div>

    <div className='col-md-3 p-0'>
                                {!searchbox && !searchboxGroup && <Chatnav 
                                socket={socket} 
                                sendDataToParent={handleDataFromChild} 
                                interactwithuserlist={interactwithuserlist} 
                                SetGroupcomponent={SetGroupcomponent} 
                                activefrParent={activefrParent} 
                                myref={childLinkRef} 
                                setMessages={setMessages} 
                                setMessagesgroup={setMessagesgroup} 

                                isNewmsgReceiver={isNewmsgReceiver} 
                                isNewmsgSender={isNewmsgSender}

                                isNewmsgGroup={isNewmsgGroup}
                                isNewmsgGroupSender={isNewmsgGroupSender}
                                setTypingStatus={setTypingStatus}
                                setTypingStatusgroup={setTypingStatusgroup}
                                setnewChatDataFromChild={setnewChatDataFromChild}
                                setnewgroupChatDataFromChild={setnewgroupChatDataFromChild}
                                SetonetoOnecomponent={SetonetoOnecomponent}
                                Setusersetting={Setusersetting}
                                loggedInuserdata={userData} 
                                setsearchbox={setsearchbox}
                                setSearchTerm={setSearchTerm}
                                setsearchboxGroup={setsearchboxGroup}
                                setSearchTermGroup={setSearchTermGroup}
                                foundTaggedUser={foundTaggedUser}
                                selectedFrmUrl={selectedFrmUrl}
                                setselectedFrmUrl={setselectedFrmUrl}
                                reloadGrouplist={reloadGrouplist}
                                setreloadGrouplist={setreloadGrouplist}
                                interactwithuserlistfavourite={interactwithuserlistfavourite} 
                                />}
                                {(searchbox || searchboxGroup) && <Chatsearch socket={socket} searchTerm={searchTerm} receiverId={receiverId} onFocus={handleFocusMessage} searchTermGroup={searchTermGroup} groupId={groupId} onFocusGroup={handleFocusMessageGroup} />}
                                </div>

                                <div className="chatbox">
                                    <div className="modal-dialog-scrollable">
                                        <div className="modal-content">
                                            {usersetting && <Setting socket={socket} loggedInuserdata={userData} />}
                                            {groupComponenet && <Chatgroupcreate socket={socket} loggedInuserdata={userData} handleCreatedGroupData={handleCreatedGroupData} />}
                                            {!groupComponenet && !usersetting && userboard && <div className="msg-head">
                                                <div className="row">
                                                    <div className="col-7">
                                                        <div className="d-flex align-items-center">
                                                            <div className="chat-list">
                                                                {dataFromChild.shortName != null ? (
                                                                    <div className="d-flex align-items-center pb-2">
                                                                        {/* <div className="flex-shrink-0"> */}
                                                                            {/*<img className="img-fluid chat_img" src={userProfile} alt="user img" />*/}
                                                                            {/* <span class="shortName">{dataFromChild.shortName}</span> */}
                                                                        {/* </div> */}
                                                                        <div className="flex-grow-1 ms-2">
                                                                            <h3>{dataFromChild.fullName}</h3>
                                                                            {/* <p>&nbsp;</p> */}
                                                                        </div>
                                                                        <div className='ms-2'>
                                                                            {favouriteUser && <a className="setFavourite" onClick={(e) => handleFavourite('DELETE',receiverId,favouriteUser)}><i class="fa fa-star"></i></a> }
                                                                            {!favouriteUser && <a className="unsetFavourite" onClick={(e) => handleFavourite('POST',receiverId,favouriteUser)}><i class="fa fa-star-o"></i></a>}
                                                                        </div>
                                                                    </div>
                                                                ) : null
                                                                }
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-3'>
                                                        {!searchbox && <a href="#" role="button" title="Search Messages" onClick={handlesearchbox}> <i className="fa fa-search" aria-hidden="true"></i></a>}
                                                        {searchbox && <div><input
                                                            type="text"
                                                            placeholder="Search messages..."
                                                            value={searchTerm}
                                                            onChange={handleInputChange}
                                                            onKeyUp={handleInputChange}
                                                            className='form-control'
                                                        />
                                                        <a href="#" role="button" title="Cancel Search" onClick={cancelsearchbox}> <i className="fa fa-close" aria-hidden="true"></i></a></div>
                                                        }
                                                    </div>
                                                    <div className='col-2'>
                                                        <ul className="moreoption float-end">
                                                            <li className="navbar nav-item dropdown">
                                                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" title="View Pinned Messages" onClick={() => handlepinnedMessages(chatboardUserid,receiverId)}> <i className="fa fa-thumb-tack" aria-hidden="true"></i></a>
                                                                <ul className="dropdown-menu pinnedmessagesbox">
                                                                {pinnedMessagesData.map((chatdata) =>
                                                                 (chatdata.messageId!=null) ? (
                                                                    <li className='pinnedmessagesRow'>
                                                                        {(chatdata.deleteSts=='No') ? <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')}   {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                                                                        <p>
                                                                        {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : null  }
                                                                        </p>
                                                                    </li>
                                                                    ) : ( <b></b> )
                                                                )}
                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>}
                                            

                                            {!groupComponenet && !usersetting && userboard && receiverId && <Chatbody 
                                            socket={socket} 
                                            messages={messageResponse} 
                                            lastMessageRef={lastMessageRef} 
                                            typingStatus={typingStatus} 
                                            chatdataFromChild={chatdataFromChild}
                                            onDeleteMsg={deleteMessage}
                                            onEditMessage={handleEditMessage}
                                            newArrchatdataFromChild={newArrchatdataFromChild}
                                            onReplyMessage={handleReplyMessage}
                                            onQuotedMessage={handleQuotedMessage}
                                            messageRefs={messageRefs}
                                            highlightId={highlightId}
                                            receiverId={receiverId}
                                            />}
                                            {!groupComponenet && !usersetting && userboard && receiverId && <Chatpost socket={socket} receiverId={receiverId} senderUserData={userData} quotedMessage={quotedMessage} inputpostmsgRef={inputpostmsgRef} />}

                                            {!groupComponenet && !usersetting && groupboard && <div className="msg-head">
                                                <div className="row">
                                                <div className="col-7">
                                                    <div className="d-flex align-items-center">
                                                        <div className="chat-list">
                                                        
                                                        {groupdataFromChild.shortName != null ? (
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0">
                                                                    {/*<img className="img-fluid chat_img" src={userProfile} alt="user img" />*/}
                                                                    {/* <span class="shortName">{groupdataFromChild.shortName}</span> */}
                                                                </div>
                                                                <div className="flex-grow-1 ms-2">
                                                                    <h3>{groupdataFromChild.fullName} </h3>
                                                                </div>
                                                                <div className='ms-2'>
                                                                    {favouriteGroup && <a className="setFavourite" onClick={(e) => handleFavouriteGroup('DELETE',groupId,favouriteGroup)}><i class="fa fa-star"></i></a> }
                                                                    {!favouriteGroup && <a className="unsetFavourite" onClick={(e) => handleFavouriteGroup('POST',groupId,favouriteGroup)}><i class="fa fa-star-o"></i></a>}
                                                                </div>
                                                            </div>
                                                        ) : null
                                                        }
                                                        </div>
                                                        </div>
                                                        <ul className="nav nav-tabs border-0 p-0 mb-0" id="myTab" role="tablist">
                                                            <li className="nav-item" role="presentation">
                                                                <button className="nav-link active" id="chatboard-tab" data-bs-toggle="tab" data-bs-target="#chatboard" type="button" role="tab" aria-controls="chatboard" aria-selected="true">
                                                                Messages
                                                                </button>
                                                            </li>
                                                            <li className="nav-item" role="presentation">
                                                                <button className="nav-link" id="people-tab" data-bs-toggle="tab" data-bs-target="#people" type="button" role="tab" aria-controls="people" aria-selected="false">People ({groupdataFromChild.totalMember})</button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className='col-3'>
                                                        {!searchboxGroup && <a href="#" role="button" title="Search Messages" onClick={handlesearchboxGroup}> <i className="fa fa-search" aria-hidden="true"></i></a>}
                                                        {searchboxGroup && <div><input
                                                            type="text"
                                                            placeholder="Search messages..."
                                                            value={searchTermGroup}
                                                            onChange={handleInputChangeGroup}
                                                            onKeyUp={handleInputChangeGroup}
                                                            className='form-control'
                                                        />
                                                        <a href="#" role="button" title="Cancel Search" onClick={cancelsearchboxGroup}> <i className="fa fa-close" aria-hidden="true"></i></a></div>
                                                        }
                                                    </div>
                                                    <div className="col-2 text-end">
                                                        <button className="btn warnbtn me-3" onClick={e=>handleLeaveSpace(groupId,loggedInuserId,groupdataFromChild.totalMember)}> Leave Space </button>

                                                        {(createdBy===loggedInuserId) && <button className="btn danbtn me-1 " onClick={e=>handleDeleteGroup(groupId)}> Delete Group </button>} 

                                                        <ul className="moreoption float-end">
                                                            <li className="navbar nav-item dropdown">
                                                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" title="View Pinned Messages" onClick={() => handlepinnedMessagesGroup(chatboardUserid,groupId)}> <i className="fa fa-thumb-tack" aria-hidden="true"></i></a>
                                                                <ul className="dropdown-menu pinnedmessagesbox">
                                                                {pinnedMessagesDataGroup.map((chatdata) =>
                                                                (chatdata.messageId!=null) ? (
                                                                    <li className='pinnedmessagesRow'>
                                                                        {(chatdata.deleteSts=='No') ? <span className="time"><strong>{chatdata.senderName}</strong> : {moment(chatdata.timestamp).format('llll')}   {(chatdata.editSts=='Yes') && <span className='editedMsg'> | Edited</span>}</span> : null}
                                                                        <p>
                                                                        {(chatdata.deleteSts=='No') ? <span dangerouslySetInnerHTML={{__html: chatdata.message}} /> : null  }
                                                                        </p>
                                                                    </li>
                                                                    ) : ( <b>Not tagged any message!</b> )
                                                                )}
                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>}
                                            {!groupComponenet && !usersetting && groupboard && groupId && <div className="tab-content">
                                            <div className="tab-pane show active" id="chatboard" role="tabpanel" aria-labelledby="chatboard-tab">
                                            <div className="modal-content">                        
                                            {!groupComponenet && !usersetting && groupboard && groupId && <Chatgroupbody 
                                            socket={socket}
                                            messages={messagegroupResponse} 
                                            lastMessageGroupRef={lastMessageGroupRef} 
                                            typingStatusgroup={typingStatusgroup} 
                                            groupchatdataFromChild={groupchatdataFromChild}
                                            onDeleteMsgGroup={deleteMessageMsgGroup}
                                            onEditMessageGroup={handleEditMessageGroup}
                                            newArrgroupchatdataFromChild={newArrgroupchatdataFromChild}
                                            onReplyMessageGroup={handleReplyMessageGroup}
                                            onQuotedMessageGroup={handleQuotedMessageGroup}
                                            messageRefsGroup={messageRefsGroup}
                                            groupMemberdataFromChild={groupMemberdataFromChild}
                                            highlightIdGroup={highlightIdGroup}
                                            />}
                                            {!groupComponenet && !usersetting && groupboard && groupId && <Chatgrouppost socket={socket} groupId={groupId} senderUserData={userData} groupMemberdataFromChild={groupMemberdataFromChild} quotedMessageGroup={quotedMessageGroup} inputpostmsgRefgroup={inputpostmsgRefgroup} />}
                                            </div>
                                            </div>
                                            <div className="tab-pane" id="people" role="tabpanel" aria-labelledby="people-tab">
                                                <Chatgrouppeople socket={socket} groupId={groupId} senderUserData={userData} groupdataFromChild={groupdataFromChild} groupMemberdataFromChild={groupMemberdataFromChild} />
                                            </div>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/* </div> */}
            </section>
            <ToastContainer />
        </div>
    )
}

export default Chat