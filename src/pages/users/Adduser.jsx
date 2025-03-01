import React, { useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';

import axiosConfig from '../../axiosConfig';
import {Link, useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from '../../components/Footer';


const Adduser = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    const [userdataname, setUserdataname] = useState([]);
    const [userType, setuserType] = useState([]);

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
                setUserdataname(response.data[0].name);
                setuserType(response.data[0].userType);
            }
        } catch (error) {
            console.log(error.message);
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
        employeeId:''
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
                });
            }
        } catch (error) {
            //console.log(error.message);
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
            });
        }
    }

  return (
    <div>
        <Header name={userdataname}/>
        <div id="wrapper">
        <div class="content animate-panel">
        <div class="row">
        <div class="col-lg-7">
            <div class="hpanel">
                <div class="panel-heading">
                    <h3>Add User</h3>
                </div>
                <div class="panel-body">
                <form onSubmit={handleSubmit} class="form-horizontal">
                {userType=='ADMIN' ? (
                        <div class="form-group"><label class="col-sm-2 control-label">User Type</label>
                        <div class="col-sm-2">
                            <input type="radio" name="userType" value="SUBADMIN" onChange={handleChanges} /> SUBADMIN
                        </div>
                        <div class="col-sm-3">
                            <input type="radio" name="userType" value="EMPLOYEE" onChange={handleChanges} required /> EMPLOYEE
                        </div>
                        
                        </div>
                ) : null}

                {userType=='SUBADMIN' ? (
                    <div class="form-group"><label class="col-sm-2 control-label">User Type</label>
                    <div class="col-sm-10"><input type="radio" name="userType" value="EMPLOYEE" onChange={handleChanges} /> EMPLOYEE</div>
                    </div>
                ) : null}

                <div class="form-group"><label class="col-sm-2 control-label">Name</label>
                    <div class="col-sm-10"><input type="text" className="form-control" name="name" onChange={handleChanges} placeholder="Enter name" required /></div>
                </div>
                <div class="hr-line-dashed"></div>
                <div class="form-group"><label class="col-sm-2 control-label">Email</label>
                    <div class="col-sm-10"><input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" className="form-control" name="email" onChange={handleChanges} placeholder="Enter Email" required />
                    </div>
                </div>
                <div class="hr-line-dashed"></div>
                <div class="form-group"><label class="col-sm-2 control-label">Employee Id</label>
                    <div class="col-sm-10"><input type="text" className="form-control" name="employeeId" onChange={handleChanges} placeholder="Employee Id" required /></div>
                </div>
                
                <div class="hr-line-dashed"></div>
                <div class="form-group">
                    <div class="col-sm-8 col-sm-offset-2">
                        <button class="btn btn-success btn-block" type="submit">Save changes</button>
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