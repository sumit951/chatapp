import React, { useState, useEffect} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

import axiosConfig from '../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';


const Chatgroupcreate = ({loggedInuserdata}) => {
  const token = localStorage.getItem('chat-token-info')
  const [alluserdata, setAllUserdata] = useState([]);

    const fetchAllUser = async () => {
    try {
            const response = await axiosConfig.get('/user/getactivealluser')
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
    //console.log(alluserdata);
    useEffect(() => {
        if(!token)
        {
            //return navigate('/login')
            window.location.href = "/login";
        }
        fetchAllUser()
    }, [])
  const [selOption, setSelOption] = useState(['']);
  const HandelChange = (obj) => {
    setSelOption(obj)    
    //console.log(selOption);
  };  
  const[values, setValues] = useState({
      groupName:''
  })

  const handleChanges = (e) => {
      setValues({...values,[e.target.name]:e.target.value,}) 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selOption);
    console.log(values);
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
  

  //console.log("Selected::", selOption.phaseID, selOption.phaseText);
  //console.log(alluserdata);
  const animatedComponents = makeAnimated();
  
  
  const newUserslisting = alluserdata.filter(item => item.userId !== loggedInuserdata.id);
  const options = newUserslisting.map((datauser) => (
    { value: datauser.userId, label: datauser.userName }
  ))
  
  return (
    <>
      <div className="modal-body">
            <div className="msg-body">
        <div class="content animate-panel">
        <div class="row d-flex justify-content-center">
        <div class="col-lg-12">
            <div class="hpanel">
                <div class="panel-heading text-center">
                    <h3>Create Group</h3>
                </div>
                <div class="panel-body">
                <form onSubmit={handleSubmit} class="form-horizontal p-3 border rounded">
                <div class="form-group"><label class="col-sm-3 control-label">Group Name</label>
                    <div class="col-sm-9"><input type="text" className="form-control" name="groupName" onChange={handleChanges} placeholder="Enter Group Name" /></div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">Group Users</label>
                    <div class="col-sm-9">
                        <Select 
                        isClearable
                        isSearchable
                        onChange={(option) => HandelChange({selectUsers:option})}
                        components={animatedComponents}
                        isMulti
                        options={options} />
                        {/*<select className="form-control" multiple name="selectUsers[]" onChange={handleChanges} required>
                            {alluserdata.map((datauser) => (
                                <option value={datauser.userId}>{datauser.userName}</option>
                            ))}
                        </select>*/}
                    </div>
                </div>
                
                <div class="form-group mb-1">
                    <div class="col-sm-12 d-flex justify-content-end mt-1">
                        <button class="btn btn-success btn-block" type="submit">Save changes <i class="fa fa-chevron-right"></i></button>
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