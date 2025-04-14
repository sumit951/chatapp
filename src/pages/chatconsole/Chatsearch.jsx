import React, { useState, useEffect} from 'react'
import axiosConfig from '../../axiosConfig';
import moment from 'moment'
import loaderImage from "../../assets/loader.gif";

const Chatsearch = ({ socket, searchTerm, receiverId,onFocus,searchTermGroup,groupId,onFocusGroup}) => {
    
    
    const [loading, setLoading] = useState(true);  // For tracking loading state
    
    const [userChatData, setUserChatData] = useState([]);
    const fetchsearchChat = async (searchParam) => {
        //console.log(searchParam.length);
        
    try {
        if(searchParam!=null && searchParam.length>=2)
        {
            const postData = {receiverId:receiverId,searchParam:searchParam}
            const response = await axiosConfig.post(`/chat/getchatsearch`,postData)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                }   
                setUserChatData(response.data);
            
            }
        }
    } catch (error) {
    console.log(error.message);
    
    } finally {
        setLoading(false);  // Set loading to false when the API call completes
    }    
        
    }

    if(searchTerm!=null){
        //console.log(alluserdata);
        useEffect(() => {
            fetchsearchChat(searchTerm)
        }, [searchTerm])
    }

    const handleSelectUser = async(id) => {
        console.log(id);
        onFocus(id);
    };
    
    const [userChatDataGroup, setUserChatDataGroup] = useState([]);
    const fetchsearchChatGroup = async (searchParamGroup) => {
        //console.log(searchParam.length);
        
    try {
        if(searchParamGroup!=null && searchParamGroup.length>=2)
        {
            const postData = {groupId:groupId,searchParamGroup:searchParamGroup}
            const response = await axiosConfig.post(`/chat/getchatsearchgroup`,postData)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
                }   
                setUserChatDataGroup(response.data);
            
            }
        }
    } catch (error) {
    console.log(error.message);
    
    } finally {
        setLoading(false);  // Set loading to false when the API call completes
    }    
        
    }

    if(searchTermGroup!=null){
        //console.log(alluserdata);
        useEffect(() => {
            fetchsearchChatGroup(searchTermGroup)
        }, [searchTermGroup])
    }

    const handleSelectUserGroup = async(id) => {
        //console.log(id);
        onFocusGroup(id);
    };

  return (
    <>
        <div className="chatlist">
                    <div className="modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-body">
                            <div className="chat-lists">
                                <div className="tab-content">

                                    <div className="tab-pane show active" id="Alldata" role="tabpanel" aria-labelledby="Alldata-tab">
        
                                        <div className="chat-list">
                                            Search Result : {searchTerm}
                                            
                                            <div className="chat-list">
                                            {searchTerm && loading ? (
                                                    <img src={loaderImage} class="loaderimage" />
                                                ) : (
                                                <>
                                                {userChatData.map((user,i) =>
                                                {
                                                   
                                                    return (
                                                        <a key={i} 
                                                            onClick={(e) => handleSelectUser(user.messageId)} 
                                                            className={`d-flex align-items-center p-2`}
                                                            /*ref={ref}*/
                                                            /*ref={(i===0) ? myref : null}*/
                                                            title={`${(user.officeName!==null) ? user.officeName +' '+ user.cityName : ""}`}
                                                            >
                                                            <div className="flex-shrink-0">
                                                                <span className="shortName">{user.usershortName}</span>
                                                                
                                                            </div>    
                                                            <div className="flex-grow-1 ms-2">
                                                                <h3>{user.userName}</h3>
                                                                <p>
                                                                <span dangerouslySetInnerHTML={{__html: user.message}} />
                                                                </p>
                                                                <span className="time">{moment(user.timestamp).format('llll')}</span>
                                                            </div>
                                                        </a>
                                                    )
                                                }
                                                )}
                                                </>
                                                )}

                                                {searchTermGroup && loading ? (
                                                    <img src={loaderImage} class="loaderimage" />
                                                ) : (
                                                <>
                                                {userChatDataGroup.slice().reverse().map((group,i) => (
                                                <a key={i} 
                                                    onClick={(e) => handleSelectUserGroup(group.messageId)} 
                                                        className={`d-flex align-items-center p-2`}>
                                                        <div className="flex-shrink-0">
                                                            <span className="shortName">{group.groupshortName}</span>
                                                        </div>
                                                        <div className="flex-grow-1 ms-2">
                                                            <h3>{group.groupName}</h3>
                                                            <p>
                                                                <span dangerouslySetInnerHTML={{__html: group.message}} />
                                                                </p>
                                                                <span className="time">{moment(group.timestamp).format('llll')}</span>
                                                        </div>
                                                    </a>
                                                ))}
                                                </>
                                                )}
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

export default Chatsearch