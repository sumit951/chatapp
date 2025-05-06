import React, { useState, useEffect, useRef} from 'react'
import axiosConfig from '../../axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import userProfile from "../../assets/chat/user-profile.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff} from '@fortawesome/free-solid-svg-icons';
import { PulseLoader } from "react-spinners";

const Chatnav = ({ socket,sendDataToParent,interactwithuserlist,SetGroupcomponent,activefrParent,myref,setMessages,setMessagesgroup,isNewmsgReceiver,isNewmsgSender,isNewmsgGroup,isNewmsgGroupSender,setTypingStatus,setTypingStatusgroup,setnewChatDataFromChild,setnewgroupChatDataFromChild,SetonetoOnecomponent,Setusersetting,loggedInuserdata,setsearchbox,setSearchTerm,setsearchboxGroup,setSearchTermGroup,foundALLTagged,foundTaggedUser,selectedFrmUrl,setselectedFrmUrl,reloadGrouplist,setreloadGrouplist,interactwithuserlistfavourite}) => {
    
    
    const token = localStorage.getItem('chat-token-info')

    const [leftNavLoader, setleftNavLoader] = useState(true);

    const [usersloggedin, setUsers] = useState([]);

    const [selectedUser,setSelectedUser] = useState([])
    const [selectedGroup,setSelectedGroup] = useState([])
    
    const UserName = localStorage.getItem('loggedInUserName')
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    
    const [active, setActive] = useState('');

    const [userChatData, setUserChatData] = useState([]);

    const [favouritetab1, setfavouritetab1] = useState(true);
    const [othertab1, setothertab1] = useState(true);
    const togglefavouritetab1 = () => {
        setfavouritetab1(!favouritetab1);
    };
    const toggleothertab1 = () => {
        setothertab1(!othertab1);
    };
    
    const [favouritetab2, setfavouritetab2] = useState(true);
    const [othertab2, setothertab2] = useState(true);
    const togglefavouritetab2 = () => {
        setfavouritetab2(!favouritetab2);
    };
    const toggleothertab2 = () => {
        setothertab2(!othertab2);
    };

    const [favouritetab3, setfavouritetab3] = useState(true);
    const [othertab3, setothertab3] = useState(true);
    const togglefavouritetab3 = () => {
        setfavouritetab3(!favouritetab3);
    };
    const toggleothertab3 = () => {
        setothertab3(!othertab3);
    };

    const handleSelectUser = async(receiverId) => {
        //console.log('test'+receiverId);
        try {
            const encodeReceiverId = btoa(receiverId)
            let offset = 0
            const response = await axiosConfig.get(`/chat/getuserchat/${encodeReceiverId}?offset=${offset}`)
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
    
    
    useEffect(() => {
            
        socket.on('reloaddeleteMessage', async (data) => {
            console.log(data);
            handleSelectUser(data.senderid)
        })

        socket.on('reloaddeleteMessagegroup', async (data) => {
            console.log(data);
            handleSelectGroup(data.groupId)
        })
        
    }, [socket]);

    const [grouplistdata, setGrouplistdata] = useState([]);
    const fetchGrouplist = async () => {
    try {
            const response = await axiosConfig.get('/chat/getgroupinteract')
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

    const [grouplistdatafavourite, setGrouplistdatafavourite] = useState([]);
    const fetchGrouplistfavourite = async () => {
    try {
            const response = await axiosConfig.get('/chat/getgroupinteractfavourite')
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                }   
                setGrouplistdatafavourite(response.data);
            }
            else
            {
                setGrouplistdatafavourite([])
            }
        } catch (error) {
        console.log(error.message);
        setGrouplistdatafavourite([])
        }    
        
    }
    //console.log(alluserdata);
    useEffect(() => {
        fetchGrouplist()
        fetchGrouplistfavourite()
    }, [])

    useEffect(() => {
        socket.on('messagegroupResponse', (data) => {
            fetchGrouplist()
            fetchGrouplistfavourite()
        })
        socket.on('reloadgrouplist', (data) => {
            fetchGrouplist()
            fetchGrouplistfavourite()
        })
        socket.on('reloadaddmemberrequest', (data) => {
            console.log()
            fetchGrouplist()
            fetchGrouplistfavourite()
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
            fetchGrouplistfavourite()
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
    //console.log(interactwithuserlistfavourite);
    
    const newUserslistingfavourite = interactwithuserlistfavourite.filter(item => item.userName !== UserName);
    newUserslistingfavourite.forEach(user => {

        const matchingUser = newUsersloggedin.find(item => item.userId === user.userId);
        if (matchingUser) {
            user.socketID = matchingUser.socketID;
        }
    });
    //console.log(newUserslisting);
    

    const currentTime2 = new Date().getTime();

    const sortedListFavourite = [
    ...newUserslistingfavourite.map(user => ({
        type: 'user',
        id: user.userId,
        shortName: user.usershortName,
        fullName: user.userName,
        latestTimestampUpdate: user.latestTimestampUpdate,
        rawData: user,
    })),
    ...grouplistdatafavourite.map(group => ({
        type: 'group',
        id: group.groupId,
        shortName: group.groupshortName,
        fullName: group.groupName,
        latestTimestampUpdate: group.latestTimestampUpdate,
        rawData: group,
    }))
    ];
    
    // Sort descending by latestTimestampUpdate
    sortedListFavourite.sort((a, b) => Number(b.latestTimestampUpdate) - Number(a.latestTimestampUpdate));
    //console.log(sortedList);

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
    useEffect(() => {
        let timeCount = 3000;
        const timer = setTimeout(() => {
            
            setleftNavLoader(false)
        }, timeCount);

        return () => clearTimeout(timer);
    }, [])
  return (
    <>
        <div className="chatlist">
            <div className="modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="chat-header">
                        <div className="msg-search">
                            {/*<input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search" aria-label="search" />*/}
                        </div>
                        <ul className="nav nav-tabs" id="myTab-left" role="tablist">
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
                                    {leftNavLoader && <PulseLoader
                                    color="#e87a36"
                                    loading
                                    size={10}
                                    /> }

                                    {!leftNavLoader && sortedListFavourite.length>0 && <><a data-bs-toggle="collapse" onClick={togglefavouritetab1} data-bs-target="#fav-tab-1" aria-expanded="false" aria-controls="collapseExample">
                                        <i class={`fa fa-solid fa-chevron-${favouritetab1 ? 'down' : 'right'}`}></i> Favourites
                                    </a>

                                    <div class="collapse show" id="fav-tab-1">
                                        <div class="card card-body">
                                        {sortedListFavourite.map((item, i) => {
                                            if (item.type === 'user') {
                                                const user = item.rawData;
                                                const expiryTime = new Date(user.chatBusyDndExpiredon).getTime() + 60000;
                                                let dndStatus = false;
                                                let busyStatus = false;

                                                if ((currentTime2 <= expiryTime) && user.chatStatus === 'DND') dndStatus = true;
                                                if ((currentTime2 <= expiryTime) && user.chatStatus === 'Busy') busyStatus = true;

                                                return (
                                                <a key={`A-tabfav${user.userId}`}
                                                    ref={(el) => (userRefs.current[`A-tabfav${user.userId}`] = el)}
                                                    onClick={(e) => handleSelectUser(user.userId,
                                                    setSelectedUser({
                                                        shortName: user.usershortName,
                                                        fullName: user.userName,
                                                        selectedUserId: user.userId,
                                                        userboard: true,
                                                        favouriteStatus: true
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
                                                    <h3 className={`${(user.loggedInsts == 'No') ? "absentUser" : ""}`} >{user.userName}</h3>
                                                    </div>
                                                    {((isNewmsgSender.some(item => item === user.userId)) && (isNewmsgReceiver == chatboardUserid)) && <span className='showmsgnotif'><i className="fa fa-solid fa-circle"></i></span>}
                                                </a>
                                                );
                                            } else {
                                                const group = item.rawData;
                                                return (
                                                <a key={`AG-tabfav${group.groupId}`}
                                                    ref={(el) => (userRefs.current[`AG-tabfav${group.groupId}`] = el)}
                                                    onClick={(e) => handleSelectGroup(group.groupId,
                                                    setSelectedGroup({
                                                        shortName: group.groupshortName,
                                                        fullName: group.groupName,
                                                        selectedUserId: group.groupId,
                                                        totalMember: group.totalMember,
                                                        allowedMember: group.allowedMember,
                                                        createdBy: group.createdBy,
                                                        groupboard: true,
                                                        favouriteStatusGroup: true
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
                                                    {!foundTaggedUser && !foundALLTagged && ((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup != chatboardUserid)) && <span className='showmsgnotif'><i className="fa fa-solid fa-circle"></i></span>}
                                                    {((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup != chatboardUserid)) && (foundALLTagged || foundTaggedUser) && <span className='showmsgnotif'>@</span>}
                                                </a>
                                                );
                                            }
                                            })}
                                        </div>
                                    </div>
                                    <div className='clearfix'></div>
                                    <a data-bs-toggle="collapse" onClick={toggleothertab1} data-bs-target="#other-tab-1" aria-expanded="false" aria-controls="collapseExample">
                                        <i class={`fa fa-solid fa-chevron-${othertab1 ? 'down' : 'right'}`}></i> Others
                                    </a></> }

                                    {!leftNavLoader && <div class="collapse show" id="other-tab-1">
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
                                                <span className="shortName">{user.usershortName} </span>
                                                {!dndStatus && !busyStatus && user.socketID && <span className="active" title='Active'></span>}
                                                {!busyStatus && dndStatus && <span className="dnd" title='DND (Do not Disturb)'></span>}
                                                {!dndStatus && busyStatus && <span className="busy" title='Busy'></span>}
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                <h3 className={`${(user.loggedInsts == 'No') ? "absentUser" : ""}`} >{user.userName}</h3>
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
                                                {!foundTaggedUser && !foundALLTagged && ((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup != chatboardUserid)) && <span className='showmsgnotif'><i className="fa fa-solid fa-circle"></i></span>}
                                                {((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup != chatboardUserid)) && (foundTaggedUser || foundALLTagged) && <span className='showmsgnotif'>@</span>}
                                            </a>
                                            );
                                        }
                                        })}
                                        </div>   
                                    </div>}
                                </div>
                            </div>



                            <div className="tab-pane" id="Open" role="tabpanel" aria-labelledby="Open-tab">
                                <div className="chat-list">
                                    {leftNavLoader && <PulseLoader
                                    color="#e87a36"
                                    loading
                                    size={10}
                                    /> }

                                    {!leftNavLoader && newUserslistingfavourite.length>0 && <> <a data-bs-toggle="collapse" onClick={togglefavouritetab2} data-bs-target="#fav-tab-2" aria-expanded="false" aria-controls="collapseExample">
                                        <i class={`fa fa-solid fa-chevron-${favouritetab2 ? 'down' : 'right'}`}></i> Favourites
                                    </a>
                                    <div class="collapse show" id="fav-tab-2">
                                    <div class="card card-body">
                                        {newUserslistingfavourite.map((user,i) =>
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
                                                <a key={`B-tabfav${user.userId}`} 
                                                ref={(el) => (userRefs.current[`A-tab${user.userId}`] = el)}
                                                onClick={(e) => handleSelectUser(user.userId,
                                                    setSelectedUser({
                                                    shortName:user.usershortName,
                                                    fullName:user.userName,
                                                    selectedUserId:user.userId,
                                                    userboard:true,
                                                    favouriteStatus:true
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
                                                        <h3 className={`${(user.loggedInsts == 'No') ? "absentUser" : ""}`}>{user.userName}</h3>
                                                    </div>
                                                    {((isNewmsgSender.some(item => item === user.userId)) && (isNewmsgReceiver==chatboardUserid)) && <span className='showmsgnotif'><i class="fa fa-solid fa-circle"></i></span>}
                                                </a>
                                            )
                                        }
                                        )}
                                        </div>
                                    </div>
                                    <div className='clearfix'></div>
                                    <a data-bs-toggle="collapse" onClick={toggleothertab2} data-bs-target="#other-tab-2" aria-expanded="false" aria-controls="collapseExample">
                                        <i class={`fa fa-solid fa-chevron-${othertab2 ? 'down' : 'right'}`}></i> Others
                                    </a></> }
                                    
                                    {!leftNavLoader && <div class="collapse show" id="other-tab-2">
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
                                                        <h3 className={`${(user.loggedInsts == 'No') ? "absentUser" : ""}`}>{user.userName}</h3>
                                                    </div>
                                                    {((isNewmsgSender.some(item => item === user.userId)) && (isNewmsgReceiver==chatboardUserid)) && <span className='showmsgnotif'><i class="fa fa-solid fa-circle"></i></span>}
                                                </a>
                                            )
                                        }
                                        )}
                                        </div>
                                    </div>}
                                </div>
                            </div>



                            <div className="tab-pane" id="Closed" role="tabpanel" aria-labelledby="Closed-tab">

                                <div className="chat-list">
                                    {leftNavLoader && <PulseLoader
                                    color="#e87a36"
                                    loading
                                    size={10}
                                    /> }

                                    {!leftNavLoader && grouplistdatafavourite.length>0 && <> <a data-bs-toggle="collapse" onClick={togglefavouritetab3} data-bs-target="#fav-tab-3" aria-expanded="false" aria-controls="collapseExample">
                                        <i class={`fa fa-solid fa-chevron-${favouritetab3 ? 'down' : 'right'}`}></i> Favourites
                                    </a>
                                    <div class="collapse show" id="fav-tab-3">
                                        <div class="card card-body">
                                        {grouplistdatafavourite.map((group,i) => (
                                        <a key={`CG-tabfav${group.groupId}`} 
                                        ref={(el) => (userRefs.current[`AG-tabfav${group.groupId}`] = el)}
                                            onClick={(e) => handleSelectGroup(group.groupId,
                                                setSelectedGroup({
                                                shortName:group.groupshortName,
                                                fullName:group.groupName,
                                                selectedUserId:group.groupId,
                                                totalMember:group.totalMember,
                                                allowedMember:group.allowedMember,
                                                createdBy:group.createdBy,
                                                groupboard:true,
                                                favouriteStatusGroup:true
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
                                                {!foundTaggedUser && !foundALLTagged && ((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup!=chatboardUserid)) && <span className='showmsgnotif'><i class="fa fa-solid fa-circle"></i></span>}
                                                {((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup!=chatboardUserid)) && (foundTaggedUser || foundALLTagged) && <span className='showmsgnotif'>@</span>}
                                            </a>
                                        ))}
                                        </div>
                                    </div>
                                    <div className='clearfix'></div>
                                    <a data-bs-toggle="collapse" onClick={toggleothertab3} data-bs-target="#other-tab-3" aria-expanded="false" aria-controls="collapseExample">
                                        <i class={`fa fa-solid fa-chevron-${othertab3 ? 'down' : 'right'}`}></i> Others
                                    </a> </> }
                                    
                                    {!leftNavLoader && <div class="collapse show" id="other-tab-3">
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
                                                    {!foundTaggedUser && !foundALLTagged && ((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup!=chatboardUserid)) && <span className='showmsgnotif'><i class="fa fa-solid fa-circle"></i></span>}
                                                    {((isNewmsgGroupSender.some(item => item === group.groupId)) && (isNewmsgGroup!=chatboardUserid)) && (foundTaggedUser || foundALLTagged) && <span className='showmsgnotif'>@</span>}
                                                </a>
                                        ))}
                                        </div>
                                    </div>}
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