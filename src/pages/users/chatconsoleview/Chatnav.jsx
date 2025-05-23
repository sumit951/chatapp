import React, { useState, useEffect, useRef} from 'react'
import axiosConfig from '../../../axiosConfig';
import { Link, useNavigate, useParams } from 'react-router-dom';
import userProfile from "../../../assets/chat/user-profile.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff} from '@fortawesome/free-solid-svg-icons';

const Chatnav = ({ socket,sendDataToParent,interactwithuserlist,SetGroupcomponent,activefrParent,myref,setMessages,setMessagesgroup,isNewmsgReceiver,isNewmsgSender,isNewmsgGroup,isNewmsgGroupSender,setTypingStatus,setTypingStatusgroup,setnewChatDataFromChild,setnewgroupChatDataFromChild,SetonetoOnecomponent,Setusersetting,loggedInuserdata,setsearchbox,setSearchTerm,setsearchboxGroup,setSearchTermGroup,foundTaggedUser,selectedFrmUrl,setselectedFrmUrl,reloadGrouplist,setreloadGrouplist}) => {
    
    const {id} = useParams()
    //console.log(atob(id));
    const chatboardUserid = atob(id);
    const token = localStorage.getItem('chat-token-info')

    

    const [usersloggedin, setUsers] = useState([]);

    const [selectedUser,setSelectedUser] = useState([])
    const [selectedGroup,setSelectedGroup] = useState([])
    
    const UserName = localStorage.getItem('loggedInUserName')
    
    
    const [active, setActive] = useState('');

    const [userChatData, setUserChatData] = useState([]);


    const handleSelectUser = async(receiverId) => {
        //console.log('test'+receiverId);
        try {
            const encodeReceiverId = btoa(receiverId)
            const encodeSelectedUserId = btoa(chatboardUserid)
            const response = await axiosConfig.get(`/chat/getuserselectedchat/${encodeReceiverId}/${encodeSelectedUserId}`)
            /* const encodeReceiverId = btoa(receiverId)
            let offset = 0
            const response = await axiosConfig.get(`/chat/getuserchat/${encodeReceiverId}?offset=${offset}`) */
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
            setnewChatDataFromChild([])
            setsearchbox('')
            setSearchTerm('')
            setsearchboxGroup('')
            setSearchTermGroup('')
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
            setnewgroupChatDataFromChild([])
            setsearchbox('')
            setSearchTerm('')
            setsearchboxGroup('')
            setSearchTermGroup('')
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
            const encodeSelectedUserId = btoa(chatboardUserid)
            const response = await axiosConfig.get(`/chat/getgroupinteractchatboardadmin/${encodeSelectedUserId}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                }   
                setGrouplistdata(response.data);
            }
            else
            {
                setGrouplistdata([])
            }
        } catch (error) {
        console.log(error.message);
        setGrouplistdata([])
        }    
        
    }

    //console.log(alluserdata);
    useEffect(() => {
        fetchGrouplist()
        socket.on('messagegroupResponse', (data) => {
            fetchGrouplist()
        })
        socket.on('reloadgrouplist', (data) => {
            fetchGrouplist()
        })
    }, [socket])

    /* Auto Click */
    const userRefs = useRef({});

    useEffect(() => {
        //console.log(selectedFrmUrl);
        let timeCount = 1000;
        if(reloadGrouplist)
        {
            fetchGrouplist()
            setreloadGrouplist(false)
            timeCount = 2000;
        }

        if (!selectedFrmUrl) return;
        
        const timer = setTimeout(() => {
            const targetRef = userRefs.current[selectedFrmUrl];
            if (targetRef) {
            targetRef.click();
            // Delay the reset to let the component stay mounted briefly
            setTimeout(() => setselectedFrmUrl(''), 500); 
            }
        }, timeCount);

        return () => clearTimeout(timer);
        
        
    }, [selectedFrmUrl,reloadGrouplist,setreloadGrouplist]);
    /* Auto Click */

    //console.log(interactwithuserlist);
    
    const newUserslisting = interactwithuserlist.filter(item => item.userName !== UserName);
    const newUsersloggedin = usersloggedin.filter(item => item.userName !== UserName);
    //const mergedArray = newUsersloggedin.concat(newUserslisting.filter(item2 => !newUsersloggedin.some(item1 => item1.userId === item2.userId)));
    //const mergedArray = newUserslisting.filter(item2 => !newUsersloggedin.some(item1 => item1.userId === item2.userId))
    //console.log(newUsersloggedin);
    

    
    newUserslisting.forEach(user => {
        const matchingUser = newUsersloggedin.find(item => item.userId === user.userId);
        if (matchingUser) {
            user.socketID = matchingUser.socketID;
        }
    });
    
    
    //console.log(newUserslisting);
    

    const currentTime2 = new Date().getTime();


    const sortedListOther = [
    ...newUserslisting.map(user => ({
        type: 'user',
        id: user.userId,
        shortName: user.usershortName,
        fullName: user.userName,
        latestTimestampUpdate: user.latestTimestampUpdate,
        rawData: user,
    })),
    ...grouplistdata.map(group => ({
        type: 'group',
        id: group.groupId,
        shortName: group.groupshortName,
        fullName: group.groupName,
        latestTimestampUpdate: group.latestTimestampUpdate,
        rawData: group,
    }))
    ];
    
    // Sort descending by latestTimestampUpdate
    sortedListOther.sort((a, b) => Number(b.latestTimestampUpdate) - Number(a.latestTimestampUpdate));
    //console.log(sortedList);
    
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
                                <button className="nav-link active" id="Alldata-tab" data-bs-toggle="tab" data-bs-target="#Alldata" type="button" role="tab" aria-controls="Alldata" aria-selected="true"> All</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="Open-tab" data-bs-toggle="tab" data-bs-target="#Open" type="button" role="tab" aria-controls="Open" aria-selected="true"> <FontAwesomeIcon icon={faUser} size="1x" />  Direct</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="Closed-tab" data-bs-toggle="tab" data-bs-target="#Closed" type="button" role="tab" aria-controls="Closed" aria-selected="false"><FontAwesomeIcon icon={faUsers} size="1x" />  Group </button>
                            </li>
                        </ul>
                    </div>
                    <div className="modal-body">
                    <div className="chat-lists">
                        <div className="tab-content">
                            <div className="tab-pane show active" id="Alldata" role="tabpanel" aria-labelledby="Alldata-tab">
                        

                                <div className="chat-list">
                                
                                    <div class="collapse show" id="other-tab-1">
                                        <div class="card card-body">
                                        {sortedListOther.map((item, i) => {
                                        if (item.type === 'user') {
                                            const user = item.rawData;
                                            const expiryTime = new Date(user.chatBusyDndExpiredon).getTime() + 60000;
                                            let dndStatus = false;
                                            let busyStatus = false;

                                            if ((currentTime2 <= expiryTime) && user.chatStatus === 'DND') dndStatus = true;
                                            if ((currentTime2 <= expiryTime) && user.chatStatus === 'Busy') busyStatus = true;

                                            return (
                                            <a key={`A-tab${user.userId}`}
                                                ref={(el) => (userRefs.current[`A-tab${user.userId}`] = el)}
                                                onClick={(e) => handleSelectUser(user.userId,
                                                setSelectedUser({
                                                    shortName: user.usershortName,
                                                    fullName: user.userName,
                                                    selectedUserId: user.userId,
                                                    userboard: true,
                                                    favouriteStatus: false
                                                }),
                                                setSelectedGroup({}),
                                                setActive(user.userName)
                                                )}
                                                className={`d-flex align-items-center p-2 ${(activefrParent === user.userName) ? "selecteduseronetoOne" : ""} ${(active === user.userName) ? "selecteduserbg" : ""}`}
                                                title={`${(user.officeName !== null) ? user.officeName + ' ' + user.cityName : ""}`}
                                            >
                                                <div className="flex-shrink-0">
                                                <span className="shortName">{user.usershortName}</span>
                                                {!dndStatus && !busyStatus && user.socketID && <span className="active" title='Active'></span>}
                                                {!busyStatus && dndStatus && <span className="dnd" title='DND (Do not Disturb)'></span>}
                                                {!dndStatus && busyStatus && <span className="busy" title='Busy'></span>}
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                <h3>{user.userName}</h3>
                                                </div>
                                                {((isNewmsgSender.some(item => item === user.userId)) && (isNewmsgReceiver == chatboardUserid)) && <span className='showmsgnotif'><i className="fa fa-solid fa-circle"></i></span>}
                                            </a>
                                            );
                                        } else {
                                            const group = item.rawData;
                                            return (
                                            <a key={`AG-tab${group.groupId}`}
                                                ref={(el) => (userRefs.current[`AG-tab${group.groupId}`] = el)}
                                                onClick={(e) => handleSelectGroup(group.groupId,
                                                setSelectedGroup({
                                                    shortName: group.groupshortName,
                                                    fullName: group.groupName,
                                                    selectedUserId: group.groupId,
                                                    totalMember: group.totalMember,
                                                    allowedMember: group.allowedMember,
                                                    createdBy: group.createdBy,
                                                    groupboard: true,
                                                    favouriteStatusGroup: false
                                                }),
                                                setSelectedUser({}),
                                                setActive(group.groupName)
                                                )}
                                                className={`d-flex align-items-center p-2 ${(active === group.groupName) ? "selecteduserbg" : ""}`}>
                                                <div className="flex-shrink-0">
                                                <span className="shortName">{group.groupshortName}</span>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                <h3>{group.groupName}</h3>
                                                </div>
                                                {!foundTaggedUser && ((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup != chatboardUserid)) && <span className='showmsgnotif'><i className="fa fa-solid fa-circle"></i></span>}
                                                {((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup != chatboardUserid)) && foundTaggedUser && <span className='showmsgnotif'>@</span>}
                                            </a>
                                            );
                                        }
                                        })}
                                        
                                        </div>   
                                    </div>
                                </div>
                            </div>



                            <div className="tab-pane" id="Open" role="tabpanel" aria-labelledby="Open-tab">
                                <div className="chat-list">
                                
                                <div class="collapse show" id="other-tab-2">
                                    <div class="card card-body">
                                    {newUserslisting.map((user,i) =>
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
                                            <a key={`B-tab${user.userId}`} 
                                                ref={(el) => (userRefs.current[`B-tab${user.userId}`] = el)}
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
                                                title={`${(user.officeName!==null) ? user.officeName +' '+ user.cityName : ""}`}
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
                                    </div>
                                </div>
                                </div>
                            </div>



                            <div className="tab-pane" id="Closed" role="tabpanel" aria-labelledby="Closed-tab">

                                <div className="chat-list">
                                    
                                    <div class="collapse show" id="other-tab-3">
                                        <div class="card card-body">
                                        {grouplistdata.map((group,i) => (
                                        <a key={`CG-tab${group.groupId}`} 
                                        ref={(el) => (userRefs.current[`BG-tab${group.groupId}`] = el)} 
                                                onClick={(e) => handleSelectGroup(group.groupId,
                                                    setSelectedGroup({
                                                    shortName:group.groupshortName,
                                                    fullName:group.groupName,
                                                    selectedUserId:group.groupId,
                                                    totalMember:group.totalMember,
                                                    allowedMember:group.allowedMember,
                                                    createdBy:group.createdBy,
                                                    groupboard:true,
                                                    favouriteStatusGroup:false
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
                                                    {!foundTaggedUser && ((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup!=chatboardUserid)) && <span className='showmsgnotif'><i class="fa fa-solid fa-circle"></i></span>}
                                                    {((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup!=chatboardUserid)) && foundTaggedUser && <span className='showmsgnotif'>@</span>}
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
            </div>
        </div>
    </>
  )
}

export default Chatnav