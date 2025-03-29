import React, { useState, useEffect, useRef, useMemo } from 'react'
import socketIO from 'socket.io-client';
import axiosConfig,{ BASE_URL } from '../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
const socket = socketIO.connect(`${BASE_URL}`);
//const socket = socketIO.connect('https://chatserver-b6go.onrender.com');
import { Link, useNavigate } from 'react-router-dom';

import "../../assets/vendor/fontawesome/css/font-awesome.css";
import "../../assets/chat/style.css";
import logo from '../../assets/rc.png';
import smallLogo from '../../assets/Raipd_logo.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff, faGear } from '@fortawesome/free-solid-svg-icons';


import userProfile from "../../assets/chat/user-profile.png";
import Chatnav from './Chatnav';
import Chatgroupcreate from './Chatgroupcreate';
import Chatbody from './Chatbody';
import Chatpost from './Chatpost';
import Chatgroupbody from './Chatgroupbody';
import Chatgrouppost from './Chatgrouppost';
import Chatgrouppeople from './Chatgrouppeople';
import Setting from './Setting';

const Chat = ({ socket }) => { 

    const [notificationShown, setNotificationShown] = useState(false); // Track notification state
    const [isTabActive, setIsTabActive] = useState(true);
    const [isTabActivegroup, setIsTabActivegroup] = useState(true);
    //console.log(notificationShown);
    
    const requestNotificationPermission = () => {
        if (Notification.permission === "default") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              console.log("Notification permission granted");
            } else {
              console.log("Notification permission denied");
            }
          });
        }
    };

    useEffect(() => {
        if(!token)
        {
            //return navigate('/login')
            window.location.href = "/login";
        }
        requestNotificationPermission()
    }, [])

    const showNotification = (message) => {
        
        // Display browser notification
        if (Notification.permission === 'granted') {
            const notification = new Notification('New Message!', {
            body: message.message, // Content of the message
            icon: smallLogo,
            });

            notification.onclick = () => {
            console.log('Notification clicked');
            setNotificationShown(false);
            };
    
            notification.onclose = () => {
            console.log('Notification closed');
            setNotificationShown(false);
            };

            /* // Mark the notification as sent for this receiver ID
            setReceivedNotifications((prev) => ({
            ...prev,
            [message.receiverId]: true,
            })); */
        } else if (Notification.permission !== 'denied') {
            // Ask for notification permission if it's not granted
            Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                const notification = new Notification('New Message!', {
                body: message.message,
                icon: favicon,
                });
                /* setReceivedNotifications((prev) => ({
                ...prev,
                [message.receiverId]: true,
                })); */
            }
            });
        }
        
        /*if (Notification.permission === "granted") {
          const notification = new Notification("New Message Received", {
            body: message, // Assuming message contains a text field
            icon: favicon, // Optional: add an icon
          });
    
          // Optionally, handle notification clicks
          notification.onclick = () => {
            window.focus(); // Bring the window into focus
            notification.close(); // Close the notification
          };
        }*/
    };

    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    const logout = async () => {
        await localStorage.removeItem("chat-token-info");
        await localStorage.removeItem("loggedInUserName");
        await localStorage.removeItem("encryptdatatoken");
        //navigate('/login')
        window.location.href = "/login";
    };

    const [userdataname, setUserdataname] = useState([]);
    const [usertypeData, setUserType] = useState([]);
    const [userData, setUserData] = useState([]);
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))

    if (userData.status == 'Inactive') {
        logout()
    }
    
    const fetchUserInfo = async () => {
        try {
            const response = await axiosConfig.get('/auth/authenticate')
            if (response.status == 200) {
                if (response.status !== 200) {
                    //navigate('/login')
                    window.location.href = "/login";
                }
                setUserData(response.data[0]);
                setUserdataname(response.data[0].name);
                setUserType(response.data[0].userType);
            }
        } catch (error) {
            console.log(error.message);
            logout()
            //navigate('/login')
        }
    }
    //console.log((userData.status));

    useEffect(() => {
        if (!token) {
            //return navigate('/login')
            window.location.href = "/login";
        }
        fetchUserInfo()
    }, [])

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
    const [newArrgroupchatdataFromChild, setnewgroupChatDataFromChild] = useState([]);

    const [groupdataFromChild, setgroupDataFromChild] = useState("");
    const [groupchatdataFromChild, setGroupChatDataFromChild] = useState([]);

    const [groupMemberdataFromChild, setGroupMemberDataFromChild] = useState([]);

    useEffect(() => {
        //lastMessageRef.current?.scrollIntoView({ block: "end"});
    }, [messages]);
    lastMessageRef.current?.scrollIntoView({ block: "end"});

    useEffect(() => {
        //lastMessageGroupRef.current?.scrollIntoView({ block: "end"});
    }, [messages]);
    lastMessageGroupRef.current?.scrollIntoView({ block: "end"});
    
    
    useEffect(() => {
        socket.on('messageResponse', (data) => { 
            //console.log(data);
            //console.log(isTabActive);
            //console.log(notificationShown);
            if(!isTabActive && !notificationShown && data.receiverId == chatboardUserid)
            {
                showNotification(data);
                setNotificationShown(true); // Ensure notification shows only once
                setIsTabActive(true);
            }
            
            //console.log(document.visibilityState);
            
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    setIsTabActive(true);
                } else {
                    setIsTabActive(false);
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            setMessages([...messages, data])
            setNewmsgSender([...isNewmsgSender,data.senderId])
            setNewmsgReceiver(data.receiverId)
            fetchinteractwithuserlist()
        })
    }, [socket, messages,isTabActive]);

    useEffect(() => {
        socket.on('messagegroupResponse', (data) => {
            setMessagesgroup([...messagesgroup, data])
            setNewmsgGroupSender([...isNewmsgGroupSender,data.groupId])
            setNewmsgGroup(data.senderId)
            //console.log(data.groupId+"---"+data.senderId);

            if(!isTabActivegroup && !notificationShown  && data.groupId != null)
            {
                showNotification(data);
                setNotificationShown(true); // Ensure notification shows only once
            }
            
            //console.log(document.visibilityState);
            
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    setIsTabActivegroup(true);
                } else {
                    setIsTabActivegroup(false);
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            
        })
    }, [socket, messagesgroup,isTabActivegroup]);

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
    const groupId = groupdataFromChild.selectedUserId;
    const createdBy = groupdataFromChild.createdBy;
    const loggedInuserId = userData.id;
    //console.log(createdBy+''+loggedInuserId);
    
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
                    //navigate('/login')
                    window.location.href = "/login";
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
                    //navigate('/login')
                    window.location.href = "/login";
                } 
                /* toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                }); */
                
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
                    //navigate('/login')
                    window.location.href = "/login";
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
                    //navigate('/login')
                    window.location.href = "/login";
                } 

                /* toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                }); */

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
                setTypingStatus(data.typingmessge)
                //setTypingStatusgroup('')
            }
            
            if(groupId === data.groupId)
            {
                setTypingStatusgroup(data.typingmessge)
                //setTypingStatus('')
            }
        })
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
        setDataFromChild(data)
        setChatDataFromChild(userChatData)

        setgroupDataFromChild(groupdata)
        setGroupChatDataFromChild(groupChatData)
        setGroupMemberDataFromChild(groupMemberData)        
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
                    //navigate('/login')
                    window.location.href = "/login";
                } 
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                });
                setTimeout(() => {
                    //navigate('/manageuser');
                    window.location.reload()
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
                    //navigate('/login')
                    window.location.href = "/login";
                } 
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                });
                setTimeout(() => {
                    //navigate('/manageuser');
                    window.location.reload()
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
                    //navigate('/login')
                    window.location.href = "/login";
                }   
                setInteractwithuserlist(response.data);
            }
        } catch (error) {
        console.log(error.message);
        }    
        
    }
   
    useEffect(() => {
        if(!token)
        {
            //return navigate('/login')
            window.location.href = "/login";
        }
        fetchinteractwithuserlist()
    }, [])

    const [alluserdata, setAllUserdata] = useState([]);

    const [searchParam, setSearchuser] = useState();
    //console.log(searchParam);
    
    const fetchAllUser = async () => {
    try {
            const response = await axiosConfig.get(`/user/getactiveallusergroup/${searchParam}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    //navigate('/login')
                    window.location.href = "/login";
                }   
                setAllUserdata(response.data);
            }
        } catch (error) {
        console.log(error.message);
        
        }    
        
    }
    //console.log(alluserdata);
    useEffect(() => {
        if(!token)
        {
            //return navigate('/login')
            window.location.href = "/login";
        }
        fetchAllUser()
    }, [])

    const newUserslisting1 = alluserdata.filter(item => item.userId !== chatboardUserid);
    //console.log(alluserdata);
    
    const options = newUserslisting1.map((datauser) => (
        { value: datauser.userId, label: datauser.userName+' - '+datauser.userEmail }
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
                interactwithuserlist.push(selectedUserFrchat);
                setActivefrParent(selectedUserFrchatName[0].trim())
                if (childLinkRef.current) {
                childLinkRef.current.click(); // Trigger click on the child <a> tag
                //alert()
                }
                SetonetoOnecomponent(false)
            }
        }
    };
    
    return (
        <div>
            <section className="message-area">
                {/* <div className="container"> */}
                    <div className="row">
                        <div className="col-12">

                            <div id="header">
                                <div className="color-line">
                                </div>
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
                                    <div className="col-2 sharparrow">
                                        <ul className="moreoption">
                                            <li className="navbar nav-item dropdown">
                                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-plus"></i></a>
                                                <ul className="dropdown-menu">
                                                    <li><a className="dropdown-item" onClick={handleDirectGroup}>Direct Chat</a></li>
                                                    <li><a className="dropdown-item" onClick={handleCreateGroup}>Create Group</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-3 sharparrow">
                                        <div className='float-end'>
                                            <ul className="moreoption">
                                                <li className="navbar nav-item dropdown">
                                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><span> <FontAwesomeIcon icon={faUser} size="1x" /> Welcome | {userdataname}, </span> <i className="fa fa-ellipsis-v" aria-hidden="true"></i></a>
                                                    <ul className="dropdown-menu lc">
                                                        {usertypeData != 'EMPLOYEE' ? (
                                                            <li><Link to="/"></Link></li>
                                                        ) : (
                                                            null
                                                        )
                                                        }
                                                        <li> <a className="dropdown-item" onClick={handleUsersetting}><FontAwesomeIcon icon={faGear} size="1x" /> Setting</a></li>
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
                                <Chatnav 
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
                                setNotificationShown={setNotificationShown}
                                setnewChatDataFromChild={setnewChatDataFromChild}
                                setnewgroupChatDataFromChild={setnewgroupChatDataFromChild}
                                SetonetoOnecomponent={SetonetoOnecomponent}
                                Setusersetting={Setusersetting}
                                />

                                <div className="chatbox">
                                    <div className="modal-dialog-scrollable">
                                        <div className="modal-content">
                                            {usersetting && <Setting loggedInuserdata={userData} />}
                                            {groupComponenet && <Chatgroupcreate loggedInuserdata={userData} />}
                                            {!groupComponenet && !usersetting && userboard && <div className="msg-head">
                                                <div className="row">
                                                    <div className="col-12">
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
                                                                        <i class="fa fa-star"></i>
                                                                            </div>
                                                                    </div>
                                                                ) : null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>}
                                            

                                            {!groupComponenet && !usersetting && userboard && receiverId && <Chatbody 
                                            messages={messageResponse} 
                                            lastMessageRef={lastMessageRef} 
                                            typingStatus={typingStatus} 
                                            chatdataFromChild={chatdataFromChild}
                                            onDeleteMsg={deleteMessage}
                                            onEditMessage={handleEditMessage}
                                            newArrchatdataFromChild={newArrchatdataFromChild}
                                            />}
                                            {!groupComponenet && !usersetting && userboard && receiverId && <Chatpost socket={socket} receiverId={receiverId} senderUserData={userData} />}

                                            {!groupComponenet && !usersetting && groupboard && <div className="msg-head">
                                                <div className="row">
                                                <div className="col-9">
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
                                                            </div>
                                                        ) : null
                                                        }
                                                        </div>
                                                        </div>
                                                        <ul className="nav nav-tabs" id="myTab" role="tablist">
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
                                                    <div className="col-3">
                                                        <button className="btn btn-warning me-3 float-end " onClick={e=>handleLeaveSpace(groupId,loggedInuserId,groupdataFromChild.totalMember)}> Leave Space </button>

                                                        {(createdBy===loggedInuserId) && <button className="btn btn-danger me-3" onClick={e=>handleDeleteGroup(groupId)}> Delete Group </button>} 
                                                    </div>
                                                </div>
                                            </div>}
                                            {!groupComponenet && !usersetting && groupboard && groupId && <div className="tab-content">
                                            <div className="tab-pane show active" id="chatboard" role="tabpanel" aria-labelledby="chatboard-tab">
                                            <div className="modal-content">                        
                                            {!groupComponenet && !usersetting && groupboard && groupId && <Chatgroupbody 
                                            messages={messagegroupResponse} 
                                            lastMessageGroupRef={lastMessageGroupRef} 
                                            typingStatusgroup={typingStatusgroup} 
                                            groupchatdataFromChild={groupchatdataFromChild}
                                            onDeleteMsgGroup={deleteMessageMsgGroup}
                                            onEditMessageGroup={handleEditMessageGroup}
                                            newArrgroupchatdataFromChild={newArrgroupchatdataFromChild}
                                            />}
                                            {!groupComponenet && !usersetting && groupboard && groupId && <Chatgrouppost socket={socket} groupId={groupId} senderUserData={userData} groupMemberdataFromChild={groupMemberdataFromChild} />}
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