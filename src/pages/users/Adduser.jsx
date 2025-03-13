import React, { useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';

import axiosConfig from '../../axiosConfig';
import {Link, useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from '../../components/Footer';


const Adduser = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    const [userData, setUserData] = useState([]);
    const [userType, setuserType] = useState([]);

    const logout = async () => {
    await localStorage.removeItem("chat-token-info");
    await localStorage.removeItem("loggedInUserName");
        //navigate('/login')
        window.location.href = "/login";
    };

    const fetchUserInfo = async () => {
        try {
            const response = await axiosConfig.get('/auth/authenticate')
            if(response.status==200)
            {
                if(response.status !== 200)
                {
                    //navigate('/login')
                    window.location.href = "/login";
                }   
                setUserData(response.data[0]);
                setuserType(response.data[0].userType);
            }
        } catch (error) {
            console.log(error.message);
            logout()
        }    
    }

    useEffect(() => {
        if(!token)
        {
            //return navigate('/login')
            window.location.href = "/login";
        }
        fetchUserInfo()
    }, [])

    const[values, setValues] = useState({
        name:'',
        email:'',
        employeeId:'',
        chatDeleteInDays:''
    })

    const handleChanges = (e) => {
        setValues({...values,[e.target.name]:e.target.value})
        //console.log(values);
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosConfig.post('/user/adduser', values)
            if(response.status==200 && response.data.status=='success')
            {
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                });
                setTimeout(() => {
                        navigate('/manageuser');
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

    const options = [
        {
            label: "Select Days",
            value: "",
        },
        {
            label: "30 Days",
            value: "30",
        },
        {
            label: "60 Days",
            value: "60",
        },
        {
            label: "90 Days",
            value: "90",
        },
        {
            label: "120 Days",
            value: "120",
        },
    ];

  return (
    <div>
        <Header  loggedInUserdata={userData} />
        <div id="wrapper">
        <div class="content animate-panel">
        <div class="row d-flex justify-content-center">
        <div class="col-lg-6">
            <div class="hpanel">
                <div class="panel-heading text-center">
                    <h3>Add User</h3>
                </div>
                <div class="panel-body">
                <form onSubmit={handleSubmit} class="form-horizontal p-3 border rounded">
                {userType=='ADMIN' ? (
                        <div class="form-group"><label class="col-sm-3 control-label">User Type</label>
                        <div class="col-sm-3 d-flex align-items-center inr"  style={{fontSize: '11px'}}>
                            <input type="radio" name="userType" value="SUBADMIN" onChange={handleChanges} /><span className='mt-1'> SUBADMIN</span>
                        </div>
                        <div class="col-sm-3 d-flex align-items-center inr"  style={{fontSize: '11px'}}>
                            <input type="radio" name="userType" value="EMPLOYEE" onChange={handleChanges} required /><span className='mt-1'> EMPLOYEE</span>
                        </div>
                        
                        </div>
                ) : null}

                {userType=='SUBADMIN' ? (
                    <div class="form-group"><label class="col-sm-3 control-label">User Type</label>
                    <div class="col-sm-9"><input type="radio" name="userType" value="EMPLOYEE" onChange={handleChanges} /> EMPLOYEE</div>
                    </div>
                ) : null}

                <div class="form-group"><label class="col-sm-3 control-label">Name</label>
                    <div class="col-sm-9"><input type="text" className="form-control" name="name" onChange={handleChanges} placeholder="Enter name" required /></div>
                </div>
                {/* <div class="hr-line-dashed"></div> */}
                <div class="form-group"><label class="col-sm-3 control-label">Email</label>
                    <div class="col-sm-9"><input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" className="form-control" name="email" onChange={handleChanges} placeholder="Enter Email" required />
                    </div>
                </div>
                {/* <div class="hr-line-dashed"></div> */}
                <div class="form-group"><label class="col-sm-3 control-label">Employee Id</label>
                    <div class="col-sm-9"><input type="text" className="form-control" name="employeeId" onChange={handleChanges} placeholder="Employee Id" required /></div>
                </div>

                {/* <div class="hr-line-dashed"></div> */}
                <div class="form-group"><label class="col-sm-3 control-label">Chat Delete In</label>
                    <div class="col-sm-9">
                        <select className="form-control" name="chatDeleteInDays" value={values.chatDelete} onChange={handleChanges} required>
                            {options.map((option) => (
                                <option value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* <div class="hr-line-dashed"></div> */}
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
        <Footer/>
        <ToastContainer />
    </div>
  )
}

export default Adduser