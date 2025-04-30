import React, { useState, useEffect,useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';

import axiosConfig from '../axiosConfig';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../assets/rc.png';
import loaderImage from "../assets/loader.gif";


const Login = ({ socket }) => {
    const navigate = useNavigate();
    const [validateUser, setvalidateUser] = useState(false);
    const [validateUserData, setvalidateUserData] = useState(null);
    
    const [loading, setLoading] = useState(false);  // For tracking loading state

    const token = localStorage.getItem('chat-token-info')
    if (token) {
        navigate('/')
        //window.location.href = "/";
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
                //console.log(values);
                if(response.data.userType!='ADMIN')
                {
                    /* For Web code Verification */
                    setvalidateUser(true);
                    setvalidateUserData(response);
                    /* For Web code Verification */
                }
                else
                {
                    /* For Direct Login */
                    const token = response.data.token;
                    localStorage.setItem("chat-token-info", token)

                    toast.success('Login Successfully', {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: true
                    });

                    localStorage.setItem('loggedInUserName', response.data.name);
                    localStorage.setItem('encryptdatatoken', btoa(response.data.userId));
                    const UserName = localStorage.getItem('loggedInUserName')
                    const UserId = response.data.userId
                    const arrUserName = response.data.name.split(' ')


                    const userShortName = arrUserName[0].charAt(0).toUpperCase();

                    socket.emit('newUser', { userId: UserId, usershortName: userShortName, userName: UserName, socketID: socket.id });
                    //console.log(userShortName);
                    setTimeout(() => {
                        

                        if (response.data.userType == 'EMPLOYEE') {
                            navigate("/chatconsole/spaces")
                            window.location.reload();
                            //window.location.href = "/chatconsole/spaces";
                        }
                        else {
                            navigate('/')
                            window.location.reload();
                            //window.location.href = "/";
                        }


                    },
                        2000
                    );
                    /* For Direct Login */
                }
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
            navigate('/')
            //window.location.href = "/";
        }
        fetchUserInfo()
    }, [])

    /*Four Digit code */
    const [code, setCode] = useState(['', '', '', '']);
    const inputs = useRef([]);

    const handleChange = (element, index) => {
        const newCode = [...code];
        newCode[index] = element.value;

        if (/^[0-9]$/.test(element.value) && index < 3) {
        inputs.current[index + 1].focus();
        }

        setCode(newCode);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
        inputs.current[index - 1].focus();
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        const webcode = code.join('');
        //const webcode = 5100;
        //console.log(validateUserData);
        setLoading(true)
        if(validateUserData.data.email!=null && validateUserData.data.userPanel=='AP' && webcode)
        {
            
            try {
                const postData = {'email':validateUserData.data.email,'code':webcode}
                const response2 = await axiosConfig.post('https://www.thehrbulb.com/team-member-panel/api/checkWebCode', postData)
                //console.log(response2.data.status);
                console.log(response2);
                if(response2.data.status=='false')
                {
                    toast.error(response2.data.message, {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: true
                    });
                    setLoading(false)
                }
                else  if (response2.data.status == 'true') {
                    const token = validateUserData.data.token;
                    localStorage.setItem("chat-token-info", token)

                    toast.success('Login Successfully', {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: true
                    });

                    localStorage.setItem('loggedInUserName', validateUserData.data.name);
                    localStorage.setItem('encryptdatatoken', btoa(validateUserData.data.userId));
                    const UserName = localStorage.getItem('loggedInUserName')
                    const UserId = validateUserData.data.userId
                    const arrUserName = validateUserData.data.name.split(' ')


                    const userShortName = arrUserName[0].charAt(0).toUpperCase();

                    socket.emit('newUser', { userId: UserId, usershortName: userShortName, userName: UserName, socketID: socket.id });
                    //console.log(userShortName);
                    setTimeout(() => {
                        

                        if (validateUserData.data.userType == 'EMPLOYEE') {
                            navigate("/chatconsole/spaces")
                            window.location.reload();
                            //window.location.href = "/chatconsole/spaces";
                        }
                        else {
                            navigate('/')
                            window.location.reload();
                            //window.location.href = "/";
                        }


                    },
                        2000
                    );


                }
            } catch (error) {
                console.log(error.message);
                setLoading(false)
                toast.error('Invalid Login Credentials', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true
                });
            }
        }
        else if(validateUserData.data.email!=null && validateUserData.data.userPanel=='SP' && webcode)
        {
            try {
                const postData = {'email':validateUserData.data.email,'code':webcode}
                const response2 = await axiosConfig.post('https://elementk.in/spbackend/api/users/check-web-code', postData)
                //console.log(response2.data.status);
                console.log(response2);
                if(response2.data.status=='false')
                {
                    toast.error(response2.data.message, {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: true
                    });
                    setLoading(false)
                }
                else  if (response2.data.status == 'true') {
                    const token = validateUserData.data.token;
                    localStorage.setItem("chat-token-info", token)

                    toast.success('Login Successfully', {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: true
                    });

                    localStorage.setItem('loggedInUserName', validateUserData.data.name);
                    localStorage.setItem('encryptdatatoken', btoa(validateUserData.data.userId));
                    const UserName = localStorage.getItem('loggedInUserName')
                    const UserId = validateUserData.data.userId
                    const arrUserName = validateUserData.data.name.split(' ')


                    const userShortName = arrUserName[0].charAt(0).toUpperCase();

                    socket.emit('newUser', { userId: UserId, usershortName: userShortName, userName: UserName, socketID: socket.id });
                    //console.log(userShortName);
                    setTimeout(() => {
                        

                        if (validateUserData.data.userType == 'EMPLOYEE') {
                            navigate("/chatconsole/spaces")
                            window.location.reload();
                            //window.location.href = "/chatconsole/spaces";
                        }
                        else {
                            navigate('/')
                            window.location.reload();
                            //window.location.href = "/";
                        }


                    },
                        2000
                    );


                }
            } catch (error) {
                console.log(error.message);
                setLoading(false)
                toast.error('Invalid Login Credentials', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true
                });
            }
            
        }
        else
        {
            setLoading(false)
            toast.error('Enter your 4 digit webcode', {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true
            });
        }
    };
    /*Four Digit code */



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
                                {!validateUser && <form onSubmit={handleSubmit}>
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
                                </form> }

                                {validateUser && <div className="mt-5 text-center">
                                <h4>Enter 4-Digit Code</h4>
                                <form onSubmit={handleVerifyCode}>
                                    <div className="d-flex justify-content-center gap-2 my-3">
                                    {code.map((digit, index) => (
                                        <input
                                        key={index}
                                        type="text"
                                        className="form-control text-center"
                                        style={{ width: '60px', fontSize: '24px' }}
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        ref={(el) => (inputs.current[index] = el)}
                                        />
                                    ))}
                                    </div>
                                    {loading ? (
                                        <img src={loaderImage} class="loaderimage" />
                                    ) : (
                                    <>
                                    <button className="btn btn-primary" type="submit">Submit</button>
                                    </>)}
                                    
                                </form>
                                </div> }
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