import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';

import axiosConfig from '../axiosConfig';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../assets/rc.png';



const Login = ({ socket }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    if (token) {
        //return navigate('/')
        window.location.href = "/";
    }
    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosConfig.post('/auth/login', values)
            if (response.status == 200) {
                const token = response.data.token;
                localStorage.setItem("chat-token-info", token)

                toast.success('Login Successfully', {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: true
                });
                setTimeout(() => {
                    localStorage.setItem('loggedInUserName', response.data.name);
                    const UserName = localStorage.getItem('loggedInUserName')
                    const UserId = response.data.userId
                    const arrUserName = response.data.name.split(' ')


                    const userShortName = arrUserName[0].charAt(0).toUpperCase();

                    socket.emit('newUser', { userId: UserId, usershortName: userShortName, userName: UserName, socketID: socket.id });
                    console.log(userShortName);

                    if (response.data.userType == 'EMPLOYEE') {
                        window.location.href = "/chatconsole/spaces";
                    }
                    else {
                        window.location.href = "/";
                    }


                },
                    2000
                );


            }
        } catch (error) {
            console.log(error.message);
            toast.error('Invalid Login Credentials', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true
            });
        }
    }

    const fetchUserInfo = async () => {
        try {
            const response = await axiosConfig.get('/auth/authenticate')
            if (response.status == 200) {
                //const token = localStorage.getItem(token)
                //navigate('/')  
                window.location.href = "/";
            }
        } catch (error) {
            //navigate('/')
        }
    }

    useEffect(() => {
        if (token) {
            //return navigate('/')
            window.location.href = "/";
        }
        fetchUserInfo()
    }, [])

    return (
        <div>
            <div className="login-container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="hpanel">
                            <div className="panel-body shadow p-3">
                                <div className="text-center">
                                    {/* <h3>Chat APP  <i className='fa fa-comments'></i></h3> */}
                                    <div className='logoimg'>
                                        <img src={logo} alt="Logo" />
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="email">Username</label>
                                        <input type="email" placeholder="example@gmail.com" title="Please enter you username" required className="form-control" name="email" onChange={handleChanges} />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="password">Password</label>
                                        <input type="password" title="Please enter your password" placeholder="******" required name="password" className="form-control" onChange={handleChanges} />
                                    </div>
                                    <div className='col-md-12 d-flex justify-content-end pr0'>
                                        <button className="btn btn-purple btn-block">Login <i class="fa fa-chevron-right"></i></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-md-12 text-center">
                        <strong>Rapid Collaborate</strong> - Chat APP <br /> 2025 Copyright Company Name
                    </div>
                </div> */}


            </div>
            <div class="lf">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 flcont text-center">
                            <h6><a href="https://www.phdassistant.com/">Rapid Collaborate</a> - Chat APP © 2025 Copyright Company Name</h6>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login