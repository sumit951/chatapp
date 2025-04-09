import React, { useState, useEffect} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

import axiosConfig,{ DefalutGroupMember } from '../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';


const Chatgroupcreate = ({loggedInuserdata}) => {
    const token = localStorage.getItem('chat-token-info')
    const [alluserdata, setAllUserdata] = useState([]);
    const [searchParam, setSearchuser] = useState();
    //console.log(searchParam);
    
    const fetchAllUser = async () => {
    try {
            if(searchParam)
            {
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
            }
        } catch (error) {
        console.log(error.message);
        
        }    
        
    }
    //console.log(alluserdata);
    /*useEffect(() => {
        if(!token)
        {
            //return navigate('/login')
            window.location.href = "/login";
        }
        fetchAllUser()
    }, [])*/
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selOption, setSelOption] = useState(['']);
    const [showLimit, setShowLimit] = useState(false);
    const HandelChange = (obj) => {
        setSelOption(obj)    
        
        //console.log(selectedOptions.length);
        if(selectedOptions.length>=parseInt(DefalutGroupMember-1))
        {
            setShowLimit(true)
        }
        else
        {
            setShowLimit(false)
        }
    };  
    const[values, setValues] = useState({
        groupName:''
    })

    const handleChanges = (e) => {
        setValues({...values,[e.target.name]:e.target.value,}) 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        /* console.log(selOption);
        console.log(values); */
        //console.log(selOption.selectUsers.length);
        
        if(values.groupName==null)
        {
        alert('Please Enter Group Name')
        return false;
        
        }
        else if(selOption.selectUsers==null)
        {
        alert('Please Select User')
        return false;
        
        }
        else if(selOption.selectUsers.length<2)
        {
            alert('Please Select atleast 2 user for this group!')
            return false;
        }
        else
        {
        //return false;
        //console.log(values);
        const fullData = {
                ...values,
                ...selOption
            };
        try {
            const response = await axiosConfig.post('/chat/creategroup', fullData)
            if(response.status==200 && response.data.status=='success')
            {
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                });
                    setTimeout(() => {
                        navigate('/manageuser');
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
    

    //console.log("Selected::", selOption.phaseID, selOption.phaseText);
    //console.log(alluserdata);
    const animatedComponents = makeAnimated();
    
    
    const newUserslisting = alluserdata.filter(item => item.userId !== loggedInuserdata.id);
    const options = newUserslisting.map((datauser) => (
        { value: datauser.userId, label: datauser.userName+' - '+datauser.userEmail }
    ))
    
    return (
        <>
        <div className="modal-body overflown">
                <div className="msg-body">
            <div className="content animate-panel">
            <div className="row d-flex justify-content-center">
            <div className="col-lg-10 mt-5">
                <div className="hpanel">
                    <div className="panel-heading text-center">
                        <h3>Create Group</h3>
                    </div>
                    <div className="panel-body">
                    <form onSubmit={handleSubmit} className="form-horizontal p-3">
                    <div className="form-group"><label className="col-sm-3 control-label">Group Name</label>
                        <div className="col-sm-9"><input type="text" className="form-control" name="groupName" onChange={handleChanges} placeholder="Enter Group Name" /></div>
                    </div>
                    <div className="form-group mb-0">
                        <label className="col-sm-3 control-label">Group Users</label>
                        <div className="col-sm-9">
                            <Select 
                            isClearable
                            isSearchable
                            onChange={(option) => HandelChange({selectUsers:option},setSelectedOptions(option))}
                            onKeyDown={(e) => fetchAllUser(setSearchuser(e.target.value))}
                            components={animatedComponents}
                            isMulti
                            isOptionDisabled={() => selectedOptions.length >= DefalutGroupMember}
                            options={options} />
                            {/*<select className="form-control" multiple name="selectUsers[]" onChange={handleChanges} required>
                                {alluserdata.map((datauser) => (
                                    <option value={datauser.userId}>{datauser.userName}</option>
                                ))}
                            </select>*/}
                            {showLimit && <div className='alert alert-danger mt-4'>Maximum 10 members allowerd</div>}
                        </div>
                    </div>
                    
                    <div className="form-group mb-1 mt-2">
                        <div className="col-sm-12 d-flex justify-content-end mt-1">
                            <button className="btn succbtn" type="submit">Save changes <i className="fa fa-chevron-right"></i></button>
                        </div>
                    </div>
                    </form>
                    </div>
                </div>
            </div>
            </div>    
            </div>
            
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Chatgroupcreate