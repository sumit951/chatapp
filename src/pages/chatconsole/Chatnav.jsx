import React, { useState, useEffect} from 'react'
import axiosConfig from '../../axiosConfig';
import userProfile from "../../assets/chat/user-profile.png";

const Chatnav = ({ socket,sendDataToParent}) => {
    const token = localStorage.getItem('chat-token-info')
    const [usersloggedin, setUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState([])
    const UserName = localStorage.getItem('loggedInUserName')


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
            console.log(response.data);
            
            setUserChatData(response.data);
        } catch (error) {
            console.log(error.message);
            
        }    
    }
    //console.log(userChatData);
    
    sendDataToParent(selectedUser,userChatData);
    
    useEffect(() => {
        socket.on('newUserResponse', (data) => setUsers(data));
    }, [socket, usersloggedin]);
    
    const [alluserdata, setAllUserdata] = useState([]);

    const fetchAllUser = async () => {
    try {
            const response = await axiosConfig.get('/user/getalluser')
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    //navigate('/login')
                    window.location.href = "/login";
                }   
                alluserdata(response.data);
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


    const newUsersloggedin = usersloggedin.filter(item => item.userName !== UserName);
    
    
  return (
    <>
        <div className="chatlist">
            <div className="modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="chat-header">
                        <div className="msg-search">
                            <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search" aria-label="search" />
                            <a className="add" href="#"><i class="fa fa-plus"></i></a>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="chat-list">
                        {newUsersloggedin.map((user,i) => (
                            <a key={user.socketID} 
                            onClick={(e) => handleSelectUser(user.userId,setSelectedUser({
                                shortName:user.usershortName,
                                fullName:user.userName,
                                selectedUserId:user.userId
                                }))} 
                                className="d-flex align-items-center pb-2">
                                <div className="flex-shrink-0">
                                    {/*<img className="img-fluid chat_img" src={userProfile} alt="user img" />*/}
                                    <span class="shortName">{user.usershortName}</span>
                                    <span className="active"></span>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h3>{user.userName}</h3>
                                </div>
                            </a>
                        ))}
                                {/*<a href="#" className="d-flex align-items-center pb-2">
                                    <div className="flex-shrink-0">
                                        <img className="img-fluid chat_img" src={userProfile} alt="user img" />
                                        <span className="active"></span>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h3>Sumit Kumar</h3>
                                    </div>
                                </a>*/}
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Chatnav