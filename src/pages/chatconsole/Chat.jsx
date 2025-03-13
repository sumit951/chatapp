import React, { useState, useEffect, useRef, useMemo} from 'react'
import socketIO from 'socket.io-client';
import axiosConfig from '../../axiosConfig';
//const socket = socketIO.connect('http://localhost:3000');
const socket = socketIO.connect('https://chatserver-b6go.onrender.com');
import {Link, useNavigate } from 'react-router-dom';

import "../../assets/vendor/fontawesome/css/font-awesome.css";
import "../../assets/chat/style.css";
import logo from '../../assets/rc.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff} from '@fortawesome/free-solid-svg-icons';


import userProfile from "../../assets/chat/user-profile.png";
import Chatnav from './Chatnav';
import Chatgroupcreate from './Chatgroupcreate';
import Chatbody from './Chatbody';
import Chatpost from './Chatpost';
import Chatgroupbody from './Chatgroupbody';
import Chatgrouppost from './Chatgrouppost';

const Chat = ({socket}) => {
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
  if(userData.status=='Inactive')
  {   
      logout()
  }
    const fetchUserInfo = async () => {
      try {
          const response = await axiosConfig.get('/auth/authenticate')
          if(response.status==200)
          {
              if(response.status !== 200)
              {
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
      if(!token)
      {
        //return navigate('/login')
        window.location.href = "/login";
      }
      fetchUserInfo()
  }, [])

  const [messages, setMessages] = useState([]);
  const [messagesgroup, setMessagesgroup] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const lastMessageRef = useRef(null);
  
  const [dataFromChild, setDataFromChild] = useState("");
  const [chatdataFromChild, setChatDataFromChild] = useState([]);

  const [groupdataFromChild, setgroupDataFromChild] = useState("");
  const [groupchatdataFromChild, setGroupChatDataFromChild] = useState([]);
  
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
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
    let userboard = false;
    let groupboard = false;
    if(dataFromChild.userboard)
    {
        groupdataFromChild.groupboard = false;
        userboard = dataFromChild.userboard;
    } 
    
    if(groupdataFromChild.groupboard)
    {
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
    const [groupComponenet,SetGroupcomponent] = useState(false)
    
    const handleCreateGroup = async() => {
        SetGroupcomponent(true)
    }
    const handleDirectGroup = async() => {
        SetGroupcomponent(false)
    }
    //console.log(groupComponenet);
    /*Group Component */
    const handleDataFromChild = (data,userChatData,groupdata,groupChatData) => {
        setDataFromChild(data)
        setChatDataFromChild(userChatData)

        setgroupDataFromChild(groupdata)
        setGroupChatDataFromChild(groupChatData)
        //return setDataFromChild(data);
    }
  
    let countChatdataFromChild = parseInt(chatdataFromChild.length-1);
    let countmessageResponse = parseInt(messageResponse.length-1);
    if(countChatdataFromChild==-1)
    {
        countChatdataFromChild = 0
    }
    if(countmessageResponse==-1)
    {
        countmessageResponse = 0
    }

    //console.log(countChatdataFromChild+' == '+countmessageResponse);
    if(messageResponse.length>0 && countChatdataFromChild>0)
    {
        //console.log(chatdataFromChild[countChatdataFromChild].message+' == '+messageResponse[messageResponse.length].message);
        
        if(chatdataFromChild[countChatdataFromChild].message === messageResponse[countmessageResponse].message)
        {
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


  return (
    <div>
      <section className="message-area">
        <div className="container">
            <div className="row">
            <div className="col-12">
                
                <div id="header">
                <div className="color-line">
                </div>
                <div className="row">
                <div className="col-2">
                  
                  <div id="logo" className="light-version">
                  {usertypeData=='EMPLOYEE'? (
                    <div className='logoimg'><img src={logo} alt="Logo" /> </div>
                  ): (
                    <Link to="/"> 
                        <div className='logoimg'><img src={logo} alt="Logo" /> </div>
                    </Link>
                  )
                  }
                    
                  </div>
                  </div>
                  <div className="col-7">

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
                  <div className="col-3">
                  <div className='float-end'>
                  <ul className="moreoption">
                      <li className="navbar nav-item dropdown">
                          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><span> <FontAwesomeIcon icon={faUser} size="1x" /> Welcome | {userdataname}, </span> <i className="fa fa-ellipsis-v" aria-hidden="true"></i></a>
                          <ul className="dropdown-menu">
                              {usertypeData!='EMPLOYEE'? (
                                <li><Link to="/"></Link></li>
                              ): (
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
                                                    {dataFromChild.shortName !=null ? (
                                                        <div className="d-flex align-items-center pb-2">
                                                            <div className="flex-shrink-0">
                                                                {/*<img className="img-fluid chat_img" src={userProfile} alt="user img" />*/}
                                                                <span class="shortName">{dataFromChild.shortName}</span>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3 mt-3">
                                                                <h3>{dataFromChild.fullName}</h3>
                                                                <p>&nbsp;</p>
                                                            </div>
                                                        </div>
                                                    ) : null
                                                    }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                    {!groupComponenet && groupboard && <div className="msg-head">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="d-flex align-items-center">
                                                    <div className="chat-list">
                                                    {groupdataFromChild.shortName !=null ? (
                                                        <div className="d-flex align-items-center pb-2">
                                                            <div className="flex-shrink-0">
                                                                {/*<img className="img-fluid chat_img" src={userProfile} alt="user img" />*/}
                                                                <span class="shortName">{groupdataFromChild.shortName}</span>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3 mt-3">
                                                                <h3>{groupdataFromChild.fullName}</h3>
                                                                <p>&nbsp;</p>
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

                                    {!groupComponenet && groupboard && groupId && <Chatgroupbody messages={messagegroupResponse} lastMessageRef={lastMessageRef} typingStatus={typingStatus} groupchatdataFromChild={groupchatdataFromChild} />}
                                    {!groupComponenet && groupboard && groupId && <Chatgrouppost socket={socket} groupId={groupId} senderUserData={userData} />}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </section>
    </div>
  )
}

export default Chat