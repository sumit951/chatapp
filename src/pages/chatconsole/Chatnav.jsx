import React, { useState, useEffect} from 'react'
import axiosConfig from '../../axiosConfig';
import userProfile from "../../assets/chat/user-profile.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff} from '@fortawesome/free-solid-svg-icons';

const Chatnav = ({ socket,sendDataToParent,interactwithuserlist,SetGroupcomponent,activefrParent,myref,setMessages,setMessagesgroup,isNewmsgReceiver,isNewmsgSender,isNewmsgGroup,isNewmsgGroupSender,setTypingStatus,setTypingStatusgroup,setNotificationShown,setnewChatDataFromChild,setnewgroupChatDataFromChild,SetonetoOnecomponent,Setusersetting,loggedInuserdata}) => {
    
    
    const token = localStorage.getItem('chat-token-info')
    const [usersloggedin, setUsers] = useState([]);

    const [selectedUser,setSelectedUser] = useState([])
    const [selectedGroup,setSelectedGroup] = useState([])
    
    const UserName = localStorage.getItem('loggedInUserName')
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    
    const [active, setActive] = useState('');

    const [userChatData, setUserChatData] = useState([]);
    
    const handleSelectUser = async(receiverId) => {
        //console.log('test'+receiverId);
        try {
            const encodeReceiverId = btoa(receiverId)
            const response = await axiosConfig.get(`/chat/getuserchat/${encodeReceiverId}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                }   
                
            }
            //console.log(response.data);
            
            setUserChatData(response.data);
            setMessages([])
            SetGroupcomponent(false)
            SetonetoOnecomponent(false)
            Setusersetting(false)
            setTypingStatus('')
            setTypingStatusgroup('')
            setNotificationShown(false)
            setnewChatDataFromChild([])
            if(receiverId)
            {
                const index = isNewmsgSender.indexOf(receiverId);
                if (index > -1) { // only splice array when item is found
                    isNewmsgSender.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
        } catch (error) {
            console.log(error.message);
            
        }    
    }
    //console.log(userChatData);

    const [groupChatData, setGroupChatData] = useState([]);
    const [groupMemberData, setGroupMemberData] = useState([]);

    const handleSelectGroup = async(groupId) => {
        //console.log('test'+receiverId);
        try {
            const encodeGroupId = btoa(groupId)
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
            
            setGroupChatData(response.data);
            SetGroupcomponent(false)
            SetonetoOnecomponent(false)
            Setusersetting(false)
            setMessagesgroup([])
            setTypingStatus('')
            setTypingStatusgroup('')
            setNotificationShown(false)
            setnewgroupChatDataFromChild([])
            if(groupId)
            {
                const index = isNewmsgGroupSender.indexOf(groupId);
                if (index > -1) { // only splice array when item is found
                    isNewmsgGroupSender.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
        } catch (error) {
            console.log(error.message);
            
        } 
        
        try {
            const encodeGroupId = btoa(groupId)
            const response = await axiosConfig.get(`/chat/getgroupmember/${encodeGroupId}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                }   
                
            }
            
            setGroupMemberData(response.data);
        } catch (error) {
            console.log(error.message);
            
        }
    }
    //console.log(userChatData);

    sendDataToParent(selectedUser,userChatData,selectedGroup,groupChatData,groupMemberData);
    
    useEffect(() => {
        socket.on('newUserResponse', async(data) => setUsers(data));
    }, [socket, usersloggedin]);
    
    


    const [grouplistdata, setGrouplistdata] = useState([]);
    const fetchGrouplist = async () => {
    try {
            const response = await axiosConfig.get('/chat/getgrouplist')
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    //navigate('/login')
                    window.location.href = "/login";
                }   
                setGrouplistdata(response.data);
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
        fetchGrouplist()
    }, [])


    const newUserslisting = interactwithuserlist.filter(item => item.userName !== UserName);
    const newUsersloggedin = usersloggedin.filter(item => item.userName !== UserName);
    const mergedArray = newUsersloggedin.concat(newUserslisting.filter(item2 => !newUsersloggedin.some(item1 => item1.userId === item2.userId)));
    //const mergedArray = newUserslisting.filter(item2 => !newUsersloggedin.some(item1 => item1.userId === item2.userId))
    //console.log(newUsersloggedin);
    //console.log(mergedArray);
    
    /* setTimeout(
        function() {
            const element = document.getElementsByClassName('selecteduseronetoOne')[0];
            if (element) {
            element.click();  // Trigger the click on the element with 'my-class'
            }
        }
        .bind(this),
        3000
    );
    */
    /* console.log(isNewmsgReceiver);
    console.log(isNewmsgSender); */
    /* console.log(isNewmsgGroup);
    console.log(isNewmsgGroupSender); */
    const element = document.getElementsByClassName('selecteduseronetoOne')[0];
    useEffect(() => {
        setTimeout(
            function() {
                if (element) {
                    element.click();  // Trigger the click on the element with 'my-class'
                }
            },1000
        );
    }, [element]);


    //console.log(loggedInuserdata.chatStatus);
    /* let currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 30); */

    const currentTime2 = new Date().getTime();

  return (
    <>
        <div className="chatlist">
            <div className="modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="chat-header">
                        <div className="msg-search">
                            {/*<input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search" aria-label="search" />*/}
                        </div>
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="Open-tab" data-bs-toggle="tab" data-bs-target="#Open" type="button" role="tab" aria-controls="Open" aria-selected="true"> <FontAwesomeIcon icon={faUser} size="1x" />  Direct</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="Closed-tab" data-bs-toggle="tab" data-bs-target="#Closed" type="button" role="tab" aria-controls="Closed" aria-selected="false"><FontAwesomeIcon icon={faUsers} size="1x" />  Group </button>
                            </li>
                        </ul>
                    </div>
                    <div className="modal-body">
                    <div className="chat-lists">
                        <div className="tab-content">
                            <div className="tab-pane show active" id="Open" role="tabpanel" aria-labelledby="Open-tab">
                                <div className="chat-list">
                                {mergedArray.slice().reverse().map((user,i) =>
                                {
                                    const expiryTime = new Date(user.chatBusyDndExpiredon).getTime() + 60000; // expiry time in milliseconds (60 seconds)
                                    let dndStatus = false;
                                    let busyStatus = false;
                                    if ((currentTime2 <= expiryTime) && user.chatStatus=='DND')
                                    {
                                        //console.log(user.chatStatus+'timeexpired'+user.userName);
                                        dndStatus = true;
                                    }
                                    if ((currentTime2 <= expiryTime) && user.chatStatus=='Busy')
                                    {
                                        //console.log(user.chatStatus+'timeexpired'+user.userName);
                                        busyStatus = true;
                                    }
                                    return (
                                        <a key={i} 
                                        onClick={(e) => handleSelectUser(user.userId,
                                            setSelectedUser({
                                            shortName:user.usershortName,
                                            fullName:user.userName,
                                            selectedUserId:user.userId,
                                            userboard:true
                                            }),
                                            setSelectedGroup({}),
                                            setActive(user.userName)
                                        )} 
                                            className={`d-flex align-items-center p-2 ${(activefrParent===user.userName) ? "selecteduseronetoOne" : ""} ${(active===user.userName) ? "selecteduserbg" : ""}`}
                                            /*ref={ref}*/
                                            /*ref={(i===0) ? myref : null}*/
                                            >
                                            <div className="flex-shrink-0">
                                                {/*<img className="img-fluid chat_img" src={userProfile} alt="user img" />*/}
                                                <span className="shortName">{user.usershortName}</span>
                                                {!dndStatus && !busyStatus && user.socketID && <span className="active" title='Active'></span>}
                                                {!busyStatus && dndStatus && <span className="dnd" title='DND (Do not Distrub)'></span>}
                                                {!dndStatus && busyStatus && <span className="busy" title='Busy'></span>}
                                            </div>
                                            <div className="flex-grow-1 ms-2">
                                                <h3>{user.userName}</h3>
                                            </div>
                                            {((isNewmsgSender.some(item => item === user.userId)) && (isNewmsgReceiver==chatboardUserid)) && <span className='showmsgnotif'><i class="fa fa-solid fa-circle"></i></span>}
                                        </a>
                                    )
                                }
                                )}
                                {/*newUserslisting.map((user,i) => (
                                    <a key={user.socketID} 
                                    onClick={(e) => handleSelectUser(user.userId,setSelectedUser({
                                        shortName:user.usershortName,
                                        fullName:user.userName,
                                        selectedUserId:user.userId
                                        }))} 
                                        className="d-flex align-items-center pb-2">
                                        <div className="flex-shrink-0">
                                            <span className="shortName">{user.usershortName}</span>
                                            <span className="active"></span>
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h3>{user.userName}</h3>
                                        </div>
                                    </a>
                                ))*/}
                                    </div>
                            </div>
                            <div className="tab-pane" id="Closed" role="tabpanel" aria-labelledby="Closed-tab">

                                <div className="chat-list">
                                    {grouplistdata.slice().reverse().map((group,i) => (
                                    <a key={i} 
                                        onClick={(e) => handleSelectGroup(group.groupId,
                                            setSelectedGroup({
                                            shortName:group.groupshortName,
                                            fullName:group.groupName,
                                            selectedUserId:group.groupId,
                                            totalMember:group.totalMember,
                                            allowedMember:group.allowedMember,
                                            createdBy:group.createdBy,
                                            groupboard:true
                                            }),
                                            setSelectedUser({}),
                                            setActive(group.groupName)
                                        )} 
                                            className={`d-flex align-items-center p-2 ${(active===group.groupName) ? "selecteduserbg" : ""}`}>
                                            <div className="flex-shrink-0">
                                                <span className="shortName">{group.groupshortName}</span>
                                            </div>
                                            <div className="flex-grow-1 ms-2">
                                                <h3>{group.groupName}</h3>
                                            </div>
                                            {((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup!=chatboardUserid)) && <span className='showmsgnotif'><i class="fa fa-solid fa-circle"></i></span>}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Chatnav