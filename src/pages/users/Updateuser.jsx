import React, { useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axiosConfig from '../../axiosConfig';
import {Link, useNavigate, useParams } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from '../../components/Footer';


const Updateuser = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    const [userData, setUserData] = useState([]);
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
                setUserData(response.data[0]);
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

    const {id} = useParams()
    //console.log(id);
    
    const[values, setValues] = useState({
        id:id,
        name:'',
        email:'',
        employeeId:'',
        password:'',
        chatDeleteInDays:''
    })
    const selectedChatDeleteInDays = ''
    const fetchAdminInfo = async () => {
        try {
            const response = await axiosConfig.get(`/user/getadmininfo/${id}`)
            if(response.status==200)
            {
                if(response.status !== 200)
                {
                    //navigate('/login')
                    window.location.href = "/login";
                }   
                console.log(response);
                const selectedChatDeleteInDays = response.data[0].chatDeleteInDays;
                setValues({...values,
                    name:response.data[0].name,
                    email:response.data[0].email,
                    employeeId:response.data[0].employeeId,
                    password:response.data[0].decryptPassword,
                    chatDeleteInDays:response.data[0].chatDeleteInDays
                })

                
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
        fetchAdminInfo()
    }, [])



    

    const handleChanges = (e) => {
        setValues({...values,[e.target.name]:e.target.value})
        //console.log(values);
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosConfig.put('/user/updateadmininfo', values)
            if(response.status==200)
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
        <Header loggedInUserdata={userData} />
        <div id="wrapper">
        <div class="content animate-panel">
        <div class="row">
        <div class="col-lg-7">
            <div class="hpanel">
                <div class="panel-heading">
                    <h3>Update User</h3>
                </div>
                <div class="panel-body">
                <form onSubmit={handleSubmit} class="form-horizontal">

                <div class="form-group"><label class="col-sm-2 control-label">Name</label>
                    <div class="col-sm-10"><input type="text" className="form-control" name="name" onChange={handleChanges} placeholder="Enter name" value={values.name} required /></div>
                </div>
                <div class="hr-line-dashed"></div>
                <div class="form-group"><label class="col-sm-2 control-label">Email</label>
                    <div class="col-sm-10"><input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" className="form-control" name="email" value={values.email} onChange={handleChanges} placeholder="Enter Email" required />
                    </div>
                </div>
                <div class="hr-line-dashed"></div>
                <div class="form-group"><label class="col-sm-2 control-label">Employee Id</label>
                    <div class="col-sm-10"><input type="text" className="form-control" name="employeeId" value={values.employeeId} onChange={handleChanges} placeholder="Employee Id" required /></div>
                </div>

                <div class="hr-line-dashed"></div>
                <div class="form-group"><label class="col-sm-2 control-label">Chat Delete In</label>
                    <div class="col-sm-10">
                        
                        <select className="form-control" name="chatDeleteInDays" onChange={handleChanges} required value={values.chatDeleteInDays}>
                            {options.map((option) => (
                            <option value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div class="hr-line-dashed"></div>
                <div class="form-group"><label class="col-sm-2 control-label">Password</label>
                    <div class="col-sm-10"><input type="text" className="form-control" name="password" value={values.password} onChange={handleChanges} placeholder="Enter Password" /></div>
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

export default Updateuser