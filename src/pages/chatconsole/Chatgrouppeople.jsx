import React, { useState, useEffect} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

import axiosConfig from '../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff} from '@fortawesome/free-solid-svg-icons';

const Chatgrouppeople = ({ socket,groupId,senderUserData,groupdataFromChild,groupMemberdataFromChild}) => {
    const loggedInuserId = senderUserData.id;
    const token = localStorage.getItem('chat-token-info')
    //console.log(groupdataFromChild.totalMember);
    const totalMember = groupdataFromChild.totalMember;
    const animatedComponents = makeAnimated();
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
    const [selOption, setSelOption] = useState(['']);
    const HandelChange = (obj) => {
    setSelOption(obj)    
    //console.log(obj);
    };  

    const newUserslisting = alluserdata.filter(item => item.userId !== loggedInuserId);
    //console.log(newUserslisting);
    //console.log(groupMemberdataFromChild);
    let mergedArray = newUserslisting.filter(item2 => !groupMemberdataFromChild.some(item1 => item1.userId === item2.userId))
    //console.log(mergedArray);
    
    const options = mergedArray.map((datauser) => (
        { value: datauser.userId, label: datauser.userName+' - '+datauser.userEmail }
    ))
    
    const handleDelete = async(userId,groupId,totalMember) =>{
        try {
            //console.log(id);
            if(!confirm('Please Conifrm')) return false;
            const encodeGroupId = btoa(groupId)
            const encodeUserId = btoa(userId)
            const encodetotalMember = btoa(totalMember)

            const response = await axiosConfig.delete(`/chat/deletegroupmember/${encodeUserId}/${encodeGroupId}/${encodetotalMember}`)
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

    const[addpeoplebox,SetPeopleBox] = useState(false)
    
    const handleAddpeoplebox = () => {
        SetPeopleBox(true)

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(selOption);
        //console.log(values);
        //console.log(selOption.selectUsers.length);
        
        if(selOption.selectUsers==null)
        {
          alert('Please Select User')
          return false;
          
        }
        else
        {
          //return false;
          //console.log(values);
          const fullData = {
                groupId,
                ...selOption
            };
          try {
              const response = await axiosConfig.post('/chat/addmembergroup', fullData)
              if(response.status==200 && response.data.status=='success')
              {
                  toast.success(response.data.message, {
                      position: "bottom-right",
                      autoClose: 1000,
                      hideProgressBar: true
                  });
                    setTimeout(() => {
                          //navigate('/manageuser');
                        window.location.reload()
                    }, 
                    2000
                    ); 
              }
              if(response.data.status=='fail')
              {
                  toast.error(response.data.message, {
                      position: "bottom-right",
                      autoClose: 1000,
                      hideProgressBar: true
                  });
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
    }

    return (
        <>
            <div className="row">
                <div className='col-5 p-4'>
                    <div className="chat-list border rounded">
                    <button className="btn btn-default me-3 float-end " onClick={handleAddpeoplebox}> <i className='fa fa-plus'></i> ADD PEOPLE </button>
                    <br />
                    <br />
                    {groupMemberdataFromChild.map((user,i) => (
                        <div className='row'>
                        <div className='col-10'>   
                        <a key={user.socketID}
                            className="d-flex align-items-center p-2">
                            <div className="flex-shrink-0">
                                <span className="shortName">{user.usershortName}</span>
                                {user.socketID && <span className="active"></span>}
                            </div>
                            <div className="flex-grow-1 ms-2 w-90">
                                <h3>{user.userName}</h3>
                                <h6>{user.userEmail}</h6>
                            </div>
                            
                        </a>
                        </div>
                        <div className='col-1'>
                        {(user.userId!==loggedInuserId) && <a className="btn-dangeri mt-4" onClick={e=>handleDelete(user.userId,groupId,totalMember)}> <i className='fa fa-trash'></i> </a>}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                {addpeoplebox && <div className='col-7'>
                    <div class="hpanel">
                    <div class="panel-heading text-center">
                        <h3>Add People</h3>
                    </div>
                    <div class="panel-body">
                    <form onSubmit={handleSubmit} class="form-horizontal p-3 border rounded">
                    <div class="form-group">
                        <div class="col-sm-9">
                        <Select 
                        isClearable
                        isSearchable
                        onChange={(option) => HandelChange({selectUsers:option})}
                        onKeyDown={(e) => fetchAllUser(setSearchuser(e.target.value))}
                        components={animatedComponents}
                        isMulti
                        options={options} />
                        </div>
                    </div>                    
                    <div class="form-group mb-1 mt-2">
                        <div class="col-sm-9 d-flex justify-content-end mt-1">
                            <button class="btn btn-success btn-block" type="submit">Save changes <i class="fa fa-chevron-right"></i></button>
                        </div>
                    </div>
                    </form>
                    </div>
                </div>
                </div>}
            </div>
            <ToastContainer />
        </>
    )
}

export default Chatgrouppeople