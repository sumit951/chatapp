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
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    //console.log(groupdataFromChild.totalMember);
    const totalMember = groupdataFromChild.totalMember;
    const allowedMember = groupdataFromChild.allowedMember;
    //const allowedMember = 4;
    const animatedComponents = makeAnimated();
    const [alluserdata, setAllUserdata] = useState([]);
    const [searchParam, setSearchuser] = useState();
    //console.log(groupMemberdataFromChild.length +'=='+ allowedMember);
    
    const fetchAllUser = async () => {
    try {
            const response = await axiosConfig.get(`/user/getactiveallusergroup/${searchParam}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                    //window.location.href = "/login";
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
                    navigate('/login')
                    //window.location.href = "/login";
                } 
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                });
                setTimeout(() => {
                    //navigate('/manageuser');
                    location.reload()
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
    const[sendrequesBox,SetSendrequesBox] = useState(false)

    const handleAddpeoplebox = () => {
        SetPeopleBox(true)
        SetSendrequesBox(false)
    }

    const handleSendRequsetbox = () => {
        SetSendrequesBox(true)
        SetPeopleBox(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(selOption);
       
        if(selOption.selectUsers==null)
        {
          alert('Please Select User')
          return false;
          
        }
        else
        {
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
                            location.reload()
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

    const[valuesReq, setValuesReq] = useState({
        groupId:groupId,
        senderId:chatboardUserid,
        requestNumber:''
    })

    const handleChanges = (e) => {
        setValuesReq({...valuesReq,[e.target.name]:e.target.value})
        console.log(valuesReq.requestNumber);
    }

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        //console.log(valuesReq);
        //return false;

        if(valuesReq.requestNumber)
        {
            try {
                const response = await axiosConfig.post('/chat/sendaddmemberrequest', valuesReq)
                if(response.status==200 && response.data.status=='success')
                {
                    socket.emit('sendaddmemberrequest', valuesReq);

                    toast.success(response.data.message, {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: true
                    });
                        setTimeout(() => {
                            //navigate('/manageuser');
                            //window.location.reload()
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

    useEffect(() => {
        if(groupId)
        {
            //console.log(groupId);
            SetSendrequesBox(false)
            SetPeopleBox(false)
        }
    }, [groupId]);

    return (
        <>
            <div className="d-flex justify-content-between">
                <div className='col-6 p-4 hfull'>
                    <div className="chat-list">
                    {/* {allowedMember} */}
                    {(groupMemberdataFromChild.length < allowedMember) ?
                    (
                    <button className="btn addbtn me-3 " onClick={handleAddpeoplebox}> <i className='fa fa-plus'></i> ADD PEOPLE </button>
                    ) : (
                    <button className="btn addbtn me-3 " onClick={handleSendRequsetbox}> <i className='fa fa-plus'></i> SEND REQUEST </button>
                    )
                    }
                    {groupMemberdataFromChild.map((user,i) => (
                        <div className='row'>
                        <div className='col-11'>   
                        <a key={user.socketID}
                            className="d-flex align-items-center p-2 abt">
                            <div className="flex-shrink-0">
                                <span className="shortName">{user.usershortName}</span>
                                {user.socketID && <span className="active"></span>}
                            </div>
                            <div className="flex-grow-1 ms-2 w-90 textdot">
                                <h3>{user.userName}</h3>
                                <h6>{user.userEmail}</h6>
                            </div>
                            
                        </a>
                        </div>
                        <div className='col-1 abtdust'>
                        {(user.userId!==loggedInuserId) && <a className="btn-dangeri mt-4" onClick={e=>handleDelete(user.userId,groupId,totalMember)}> <i className='fa fa-trash'></i> </a>}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                {!sendrequesBox && addpeoplebox && <div className='col-6 p-4 bg-light hfull'>
                    <div class="hpanel">
                    <div class="panel-heading text-center">
                        <h3>Add People</h3>
                    </div>
                    <div class="panel-body">
                    <form onSubmit={handleSubmit} class="form-horizontal py-3 px-2 bg-light">
                    <div class="form-group">
                        <div class="col-sm-12">
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
                        <div class="col-sm-12 d-flex justify-content-end mt-1">
                            <button class="btn succbtn btn-block" type="submit">Save changes <i class="fa fa-chevron-right"></i></button>
                        </div>
                    </div>
                    </form>
                    </div>
                </div>
                </div>}

                {!addpeoplebox && sendrequesBox && <div className='col-6 p-4 bg-light hfull'>
                    <div class="hpanel">
                    <div class="panel-heading text-center">
                        <h3>Send Request</h3>
                    </div>
                    <div class="panel-body">
                    <form onSubmit={handleRequestSubmit} class="form-horizontal py-3 px-2 bg-light">
                    <div class="form-group">
                        <div class="col-sm-12">
                        <select className="form-control" name="requestNumber" value={valuesReq.requestNumber} onChange={handleChanges} required>
                        <option value="">Select Number of Members</option>
                        {
                            [...Array(10)].map((_, i) => i + 1)
                                        .map(i => <option key={i} value={i}>{i}</option>)
                        }
                        </select>
                        </div>
                    </div>                    
                    <div class="form-group mb-1 mt-2">
                        <div class="col-sm-12 d-flex justify-content-end mt-1">
                            <button class="btn succbtn btn-block" type="submit">Save changes <i class="fa fa-chevron-right"></i></button>
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