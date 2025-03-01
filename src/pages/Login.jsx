import React, { useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';

import axiosConfig from '../axiosConfig';
import {Link, useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    const [values,setValues] =  useState({
        email:'',
        password:''
    })
    
    const handleChanges = (e) => {
        setValues({...values,[e.target.name]:e.target.value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axiosConfig.post('/auth/login', values)
            if(response.status==200)
            {
                const token = response.data.token;
                localStorage.setItem("chat-token-info",token)
               
                toast.success('Login Successfully', {
                    position: "bottom-right",
                    autoClose: 1000,
                });
                setTimeout(() => {
                        window.location.href = "/";
                        console.log(response.data.token);
                    }, 
                    2000
                );
                
                
            }
        } catch (error) {
            console.log(error.message);
            toast.error('Invalid Login Credentials', {
                position: "bottom-right",
                autoClose: 2000,
            });
        }
    }

    const fetchUserInfo = async () => {
        try {
            const response = await axiosConfig.get('/auth/authenticate')
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                    //navigate('/')  
                    window.location.href = "/"; 
            }
        } catch (error) {
            //navigate('/')
        }    
    }

    useEffect(() => {
        if(token)
        {
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
                    <div className="text-center m-b-md">
                        <h3>Chat APP  <i className='fa fa-comments'></i></h3>
                    </div> 
                    <div className="hpanel">
                        <div className="panel-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="email">Username</label>
                                        <input type="email" placeholder="example@gmail.com" title="Please enter you username" required className="form-control" name="email" onChange={handleChanges} />
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label" htmlFor="password">Password</label>
                                        <input type="password" title="Please enter your password" placeholder="******" required name="password" className="form-control" onChange={handleChanges} />
                                    </div>
                                    <button className="btn btn-success btn-block">Login</button>
                                </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 text-center">
                    <strong>Rapid Collaborate</strong> - Chat APP <br/> 2025 Copyright Company Name
                </div>
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}

export default Login