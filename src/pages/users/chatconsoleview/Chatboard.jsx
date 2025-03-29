import React, { useState, useEffect, useRef } from 'react'

import axiosConfig from '../../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';

import "../../../assets/vendor/fontawesome/css/font-awesome.css";
import "../../../assets/chat/style.css";
import logo from '../../../assets/rc.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';

import Chatnav from './Chatnav';
import Chatbody from './Chatbody';
import Chatgroupbody from './Chatgroupbody';
import Chatgrouppeople from './Chatgrouppeople';

const Chat = () => {

    const {id} = useParams()
    //console.log(atob(id));
    const chatboardUserid = atob(id);

    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    const logout = async () => {
        await localStorage.removeItem("chat-token-info");
        await localStorage.removeItem("loggedInUserName");
        await localStorage.removeItem("encryptdatatoken");
        //navigate('/login')
        window.location.href = "/login";
    };

    const [userlogindataname, setUserlogindataname] = useState([]);
    const [userlogintypeData, setUserloginType] = useState([]);
    const [userloginData, setUserloginData] = useState([]);
    if (userloginData.status == 'Inactive') {
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
                setUserloginData(response.data[0]);
                setUserlogindataname(response.data[0].name);
                setUserloginType(response.data[0].userType);
            }
        } catch (error) {
            console.log(error.message);
            logout()
            //navigate('/login')
        }
    }
    

    useEffect(() => {
        if (!token) {
            //return navigate('/login')
            window.location.href = "/login";
        }
        fetchUserInfo()
    }, [])

    const [userdataname, setUserdataname] = useState([]);
    const [usertypeData, setUserType] = useState([]);
    const [userData, setUserData] = useState([]);
    const fetchAdminInfo = async () => {
        try {
            const response = await axiosConfig.get(`/user/getadmininfo/${chatboardUserid}`)
            if(response.status==200)
            {
                if(response.status !== 200)
                {
                    //navigate('/login')
                    window.location.href = "/login";
                }   
                //console.log(response);
                setUserData(response.data[0]);
                setUserdataname(response.data[0].name);
                setUserType(response.data[0].userType);

                
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
        fetchAdminInfo()
    }, [])
    //console.log((userData));
    
    const lastMessageRef = useRef(null);
    const lastMessageGroupRef = useRef(null);

    const [dataFromChild, setDataFromChild] = useState("");
    const [chatdataFromChild, setChatDataFromChild] = useState([]);

    const [groupdataFromChild, setgroupDataFromChild] = useState("");
    const [groupchatdataFromChild, setGroupChatDataFromChild] = useState([]);

    const [groupMemberdataFromChild, setGroupMemberDataFromChild] = useState([]);

    
    lastMessageRef.current?.scrollIntoView({ block: "end"});
    lastMessageGroupRef.current?.scrollIntoView({ block: "end"});

    
    const receiverId = dataFromChild.selectedUserId;
    const groupId = groupdataFromChild.selectedUserId;
    
    
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


    const [alluserdata, setAllUserdata] = useState([]);

    const fetchAllUser = async () => {
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
                setAllUserdata(response.data);
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
        fetchAllUser()
    }, [])
    //console.log(alluserdata);
    

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
                                            <Link to="/">
                                                <div className='logoimg'><img src={logo} alt="Logo" /> </div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-7 sharparrow">
                                        <div className="d-flex align-items-center justify-content-center mt-3">
                                            <div className="badge badge-primary p-2">
                                            {userdataname} - Chatboard
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3 sharparrow">
                                        <div className='float-end'>
                                            <ul className="moreoption">
                                                <li className="navbar nav-item dropdown">
                                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><span> <FontAwesomeIcon icon={faUser} size="1x" /> Welcome | {userlogindataname}, </span> <i className="fa fa-ellipsis-v" aria-hidden="true"></i></a>
                                                    <ul className="dropdown-menu lc">
                                                        {usertypeData != 'EMPLOYEE' ? (
                                                            <li><Link to="/"></Link></li>
                                                        ) : (
                                                            null
                                                        )
                                                        }
                                                        <li> <a className="dropdown-item" onClick={logout}><FontAwesomeIcon icon={faPowerOff} size="1x" /> LOGOUT</a></li>
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
                                <Chatnav sendDataToParent={handleDataFromChild} senderUserData={userData} alluserdata={alluserdata} />

                                <div className="chatbox">
                                    <div className="modal-dialog-scrollable">
                                        <div className="modal-content">
                                            
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
                                            

                                            {!groupComponenet && userboard && receiverId && <Chatbody lastMessageRef={lastMessageRef} chatdataFromChild={chatdataFromChild} senderUserData={userData}  />}
                                           

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
                                                </div>
                                            </div>}
                                            {!groupComponenet && groupboard && groupId && <div className="tab-content">
                                            
                                            <div className="tab-pane show active" id="chatboard" role="tabpanel" aria-labelledby="chatboard-tab">                        
                                            {!groupComponenet && groupboard && groupId && <Chatgroupbody lastMessageGroupRef={lastMessageGroupRef} groupchatdataFromChild={groupchatdataFromChild} senderUserData={userData} />}
                                            </div>

                                            <div className="tab-pane" id="people" role="tabpanel" aria-labelledby="people-tab">
                                                <Chatgrouppeople groupId={groupId} senderUserData={userData} groupdataFromChild={groupdataFromChild} groupMemberdataFromChild={groupMemberdataFromChild} />
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