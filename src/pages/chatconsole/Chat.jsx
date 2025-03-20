import React, { useState, useEffect, useRef, useMemo } from 'react'
import socketIO from 'socket.io-client';
import axiosConfig from '../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
//const socket = socketIO.connect('http://localhost:3000');
const socket = socketIO.connect('https://chatserver-b6go.onrender.com');
import { Link, useNavigate } from 'react-router-dom';

import "../../assets/vendor/fontawesome/css/font-awesome.css";
import "../../assets/chat/style.css";
import logo from '../../assets/rc.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';


import userProfile from "../../assets/chat/user-profile.png";
import Chatnav from './Chatnav';
import Chatgroupcreate from './Chatgroupcreate';
import Chatbody from './Chatbody';
import Chatpost from './Chatpost';
import Chatgroupbody from './Chatgroupbody';
import Chatgrouppost from './Chatgrouppost';
import Chatgrouppeople from './Chatgrouppeople';

const Chat = ({ socket }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    const logout = async () => {
        await localStorage.removeItem("chat-token-info");
        await localStorage.removeItem("loggedInUserName");
        //navigate('/login')
        window.location.href = "/login";
    };

    const [userdataname, setUserdataname] = useState([]);
    const [usertypeData, setUserType] = useState([]);
    const [userData, setUserData] = useState([]);
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

    const [messages, setMessages] = useState([]);
    const [messagesgroup, setMessagesgroup] = useState([]);
    const [typingStatus, setTypingStatus] = useState('');
    const lastMessageRef = useRef(null);
    const lastMessageGroupRef = useRef(null);

    const [dataFromChild, setDataFromChild] = useState("");
    const [chatdataFromChild, setChatDataFromChild] = useState([]);

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

    /*useEffect(() => {
      socket.on('savedmessageResponse', (data) => setMessages([chatdataFromChild, data]));
    }, [socket, messages]);*/

    useEffect(() => {
        socket.on('messageResponse', (data) => setMessages([...messages, data]));
    }, [socket, messages]);

    useEffect(() => {
        socket.on('messagegroupResponse', (data) => setMessagesgroup([...messagesgroup, data]));
    }, [socket, messagesgroup]);


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

    useEffect(() => {
        socket.on('typingResponse', (data) => setTypingStatus(data));
    }, [socket]);


    /*Group Component */
    const [groupComponenet, SetGroupcomponent] = useState(false)

    const handleCreateGroup = async () => {
        SetGroupcomponent(true)
    }
    const handleDirectGroup = async () => {
        SetGroupcomponent(false)
    }
    //console.log(groupComponenet);
    /*Group Component */
    const handleDataFromChild = (data, userChatData, groupdata, groupChatData,groupMemberData) => {
        setDataFromChild(data)
        setChatDataFromChild(userChatData)

        setgroupDataFromChild(groupdata)
        setGroupChatDataFromChild(groupChatData)
        setGroupMemberDataFromChild(groupMemberData)
        //return setDataFromChild(data);
    }

    let countChatdataFromChild = parseInt(chatdataFromChild.length - 1);
    let countmessageResponse = parseInt(messageResponse.length - 1);
    if (countChatdataFromChild == -1) {
        countChatdataFromChild = 0
    }
    if (countmessageResponse == -1) {
        countmessageResponse = 0
    }

    //console.log(countChatdataFromChild+' == '+countmessageResponse);
    if (messageResponse.length > 0 && countChatdataFromChild > 0) {
        //console.log(chatdataFromChild[countChatdataFromChild].message+' == '+messageResponse[messageResponse.length].message);

        if (chatdataFromChild[countChatdataFromChild].message === messageResponse[countmessageResponse].message) {
            chatdataFromChild.pop()
        }
        //console.log(chatdataFromChild[countChatdataFromChild]);
    }
    /*if(messageResponse.length=='0' && countChatdataFromChild>0)
    {
        const messageResponse = []
    }*/
    /*else if(messageResponse.length=='0' && countChatdataFromChild>0)
    {
        if((chatdataFromChild[0].message === messageResponse[0].message))
        {
            chatdataFromChild.pop()
        }
    }*/
    
    const handleDelete = async(id) =>{
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
                                    <div className="col-2">

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
                                    <div className="col-7 sharparrow">
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
                                <Chatnav socket={socket} sendDataToParent={handleDataFromChild} />

                                <div className="chatbox">
                                    <div className="modal-dialog-scrollable">
                                        <div className="modal-content">
                                            {groupComponenet && <Chatgroupcreate loggedInuserdata={userData} />}
                                            {!groupComponenet && userboard && <div className="msg-head">
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
                                            

                                            {!groupComponenet && userboard && receiverId && <Chatbody messages={messageResponse} lastMessageRef={lastMessageRef} typingStatus={typingStatus} chatdataFromChild={chatdataFromChild} />}
                                            {!groupComponenet && userboard && receiverId && <Chatpost socket={socket} receiverId={receiverId} senderUserData={userData} />}

                                            {!groupComponenet && groupboard && <div className="msg-head">
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

                                                        {(createdBy===loggedInuserId) && <button className="btn btn-danger me-3" onClick={e=>handleDelete(groupId)}> Delete Group </button>} 
                                                    </div>
                                                </div>
                                            </div>}
                                            {!groupComponenet && groupboard && groupId && <div className="tab-content">
                                            <div className="tab-pane show active" id="chatboard" role="tabpanel" aria-labelledby="chatboard-tab">                        
                                            {!groupComponenet && groupboard && groupId && <Chatgroupbody messages={messagegroupResponse} lastMessageGroupRef={lastMessageGroupRef} typingStatus={typingStatus} groupchatdataFromChild={groupchatdataFromChild} />}
                                            {!groupComponenet && groupboard && groupId && <Chatgrouppost socket={socket} groupId={groupId} senderUserData={userData} groupMemberdataFromChild={groupMemberdataFromChild} />}
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