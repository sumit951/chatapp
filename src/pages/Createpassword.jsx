import React, { useState, useEffect} from 'react'
import axiosConfig from '../axiosConfig';
import {Link, useNavigate, useParams } from 'react-router-dom';

const Createpassowrd = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    const {id,verify} = useParams();
    
    const data = {
        userId : id,
        verifyOtp : verify
    }
    
    const [userdataid, setUserdataid] = useState([]);

    const checkUserInfo = async () => {
        try {
            const response = await axiosConfig.post('/auth/checkuser',data)
            if(response.status==200)
            {
                //console.log(response.data[0].id);
                setUserdataid(response.data[0].id);
            }
        } catch (error) {
            console.log(error);
            
        }    
    }

    const [input, setInput] = useState({
        id : id,
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState({
    password: '',
    confirmPassword: '',
    });

    const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
        ...prev,
        [name]: value,
    }));
    validateInput(e);
    };

    const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
        const stateObj = { ...prev, [name]: '' };

        switch (name) {
        
        case 'password':
            if (!value) {
            stateObj[name] = 'Please enter Password.';
            } else if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj['confirmPassword'] =
                'Password and Confirm Password does not match.';
            } else {
            stateObj['confirmPassword'] = input.confirmPassword
                ? ''
                : error.confirmPassword;
            }
            break;

        case 'confirmPassword':
            if (!value) {
            stateObj[name] = 'Please enter Confirm Password.';
            } else if (input.password && value !== input.password) {
            stateObj[name] = 'Password and Confirm Password does not match.';
            }
            break;

        default:
            break;
        }

        return stateObj;
    });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            if(input.password === input.confirmPassword)
            {
                const response = await axiosConfig.put('/auth/createpassword', input)
                if(response.status==200)
                {
                    /*const token = response.data.token;
                    localStorage.setItem("chat-token-info",token)*/
                    return navigate('/login');
                    console.log(response.data.token);
                    
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchUserInfo = async () => {
        try {
            const response = await axiosConfig.get('/auth/authenticate')
            if(response.status==200)
            {
                const token = localStorage.getItem(token)
                navigate('/login')   
            }
        } catch (error) {
            console.log(error);
            
        }    
    }

    useEffect(() => {
        if(token)
        {
            return navigate('/')
        }
        fetchUserInfo()
    }, [])

    useEffect(() => {
        if(token)
        {
            return navigate('/')
        }
        checkUserInfo()
        
    }, [])
return (
    <div>
        <div className="login-container">
            <div className="row">
                <div className="col-md-12">
                    <div className="text-center m-b-md">
                        <h3>Create Paswword  <i className='fa fa-comments'></i></h3>
                    </div> 
                    <div className="hpanel">
                        <div className="panel-body">
                        {userdataid > 0 ? (
                            <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                    <label className="control-label" htmlFor="password">Password </label>
                                    <input type="password" title="Please enter your password" placeholder="******" required name="password" className="form-control"
                                    value={input.password}
                                    onChange={onInputChange}
                                    onBlur={validateInput}
                                    />
                                    {error.password && <span className="err">{error.password}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="control-label" htmlFor="confirmPassword">Confirm Password</label>
                                    <input type="password" title="Please enter your password" placeholder="******" required name="confirmPassword" className="form-control" 
                                    value={input.confirmPassword}
                                    onChange={onInputChange}
                                    onBlur={validateInput}
                                    />
                                    {error.confirmPassword && (
                                    <span className="err">{error.confirmPassword}</span>
                                    )}
                                </div>
                                <button className="btn btn-success btn-block">Login</button>
                            </form>
                        ) : (
                            <center><h3>URL Expired</h3></center>
                        )}
                            
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
    </div>
  )

}

export default Createpassowrd