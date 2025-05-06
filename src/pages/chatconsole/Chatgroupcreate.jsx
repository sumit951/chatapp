import React, { useState, useEffect} from 'react'
import Select, { components } from 'react-select'
import makeAnimated from 'react-select/animated';

import axiosConfig,{ DefaultGroupMember } from '../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Chatgroupcreate = ({socket,loggedInuserdata,handleCreatedGroupData}) => {
    const token = localStorage.getItem('chat-token-info')
    const navigate = useNavigate();
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
                        window.location.reload();
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
    const [selectedOptionsfrReq, setSelectedOptionsfrReq] = useState([]);
    const [selOption, setSelOption] = useState(['']);
    const [showLimit, setShowLimit] = useState(false);
    const HandelChange = (obj) => {
        setSelOption(obj)    


        const handlchange =(e)=>{
            setSelectedOptions(e.target.value);
        }
        
        //console.log(selectedOptions.length);
        if(selectedOptions.length>=parseInt(DefaultGroupMember-1))
        {
            setShowLimit(true)
        }
        else
        {
            setShowLimit(false)
        }
    };  
    const[values, setValues] = useState({
        groupName:null
    })

    const handleChanges = (e) => {
        setValues({...values,[e.target.name]:e.target.value,}) 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        /* console.log(selOption);
        console.log(values);*/
        //console.log(selOption.selectUsers.length);
        //console.log(selectedOptionsfrReq.length);
        if(values.groupName==null)
        {
        alert('Please Enter Group Name')
        return false;
        
        }
        else if(selOption.selectUsers==null && selectedOptionsfrReq.length==0)
        {
            if(selOption.selectUsers==null)
            {
            alert('Please Select User')
            return false;
            
            }
            else if(selOption.selectUsers.length<2)
            {
                alert('Please Select atleast 2 user for this group!')
                return false;
            }
            else if(selOption.selectUsers.length>DefaultGroupMember)
            {
                alert(`Select only ${DefaultGroupMember} user for this group!`)
                return false;
            }
        }
        
        else
        {
        //return false;
        //console.log(values);
        const fullData = {
                ...values,
                ...selOption,
                selectedOptionsfrReq
            };
        try {
            const response = await axiosConfig.post('/chat/creategroup', fullData)
            if(response.status==200 && response.data.status=='success')
            {
                handleCreatedGroupData(response.data.groupid)
                socket.emit('sendaddmemberrequest', response.data);
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                });
                    setTimeout(() => {
                        navigate('/chatconsole/spaces');
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
        { value: datauser.userId, label: datauser.userName +' - Member in '+ datauser.groupCount+" group(s)", isDisabled: (datauser.userType=='EMPLOYEE' && datauser.groupCount>=datauser.allowedInGroups) ? true : false }
    ))
    
    const CustomOption = (props) => {
        const { data, innerRef, innerProps } = props;
      
        if (data.isDisabled) {
          return (
            <div ref={innerRef} {...innerProps} style={{ padding: 10, opacity: 0.5 }}>
              <span>{data.label} (Disabled)</span>  {(selectedOptionsfrReq.includes(data.value)) ? <span className='badge badge-warning'> Requested </span> : <button
                className='badge badge-warning'
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // prevent menu from closing
                  handleEnableOption(data.value);
                }}
                style={{ marginLeft: 10 }}
              >
                Send Request
              </button>}
            </div>
          );
        }
      
        return <components.Option {...props} />;
    };

    const handleEnableOption = (value) => {
        // Simulate request to enable option
        //console.log('Request to enable:', value);
        if(!selectedOptionsfrReq.includes(value) && confirm('Please Confirm!'))
        {
            setSelectedOptionsfrReq([...selectedOptionsfrReq,value])
        }
    };
    console.log(selectedOptionsfrReq);
    
    return (
        <>
        <div className="modal-body overflown">
         <div className="msg-body">
            <div className="content animate-panel">
            <div className="row d-flex justify-content-center">
            <div className="col-lg-10 mt-5">
                <div className="hpanel">
                    <div className="panel-heading d-flex flex-column align-items-center text-center me-5">
                        <h3>Create Group</h3>
                        <p className="mb-0">Start a group conversation with others.</p>
                    </div>
                    <div className="panel-body">
                    <form onSubmit={handleSubmit} className="form-horizontal ">
                    <div className="form-group row"><label className="col-sm-3 control-label"></label>
                        <div className="col-sm-8 col-md-5"><input type="text" className="form-control" name="groupName" onChange={handleChanges} placeholder="Enter Group Name" /></div>
                    </div>
                    <div className="form-group row  mb-0">
                        <label className="col-sm-3 control-label"></label>
                        <div className="col-sm-8 col-md-5">
                            <Select 

                            isClearable
                            isSearchable
                            onChange={(option) => HandelChange({selectUsers:option},setSelectedOptions(option))}
                            onKeyDown={(e) => fetchAllUser(setSearchuser(e.target.value))}
                            isMulti
                            /* isOptionDisabled={() => selectedOptions.length >= DefaultGroupMember} */
                            options={options}
                            components={{ Option: CustomOption }}
                            />
                            {/*<select className="form-control" multiple name="selectUsers[]" onChange={handleChanges} required>
                                {alluserdata.map((datauser) => (
                                    <option value={datauser.userId}>{datauser.userName}</option>
                                ))}
                            </select>*/}
                            {showLimit && <div className='alert alert-danger mt-4'>Maximum 10 members allowerd</div>}
                        </div>
                    </div>
                    
                    <div className="form-group row mt-3">
                        <div className="col-sm-12 d-flex justify-content-center mt-5  position-relative">
                            {selectedOptions && (
                            <button className="btn succbtn position-relative overflow-hidden me-5" type="submit" style={{display:selectedOptions?"block":"none"}} > 
                            <span className="transition"></span>
                            <span className="gradient"></span>
                            <span className="label">Save changes</span>
                            <i className="fa fa-chevron-right"></i></button>
                            )}
                            <span class="ripple"></span>
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