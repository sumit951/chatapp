import React, { useState, useEffect} from 'react'
import socketIO from 'socket.io-client';
import axiosConfig,{ BASE_URL } from '../axiosConfig';
import {Link, useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from '../components/Footer';

const Dashboard = ({socket}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('chat-token-info')
  const [userData, setUserData] = useState([]);
  const logout = async () => {
    await localStorage.removeItem("chat-token-info");
    await localStorage.removeItem("loggedInUserName");
    await localStorage.removeItem("encryptdatatoken");
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
              
              
          }
      } catch (error) {
          console.log(error.message);
          logout()
          //navigate('/login')
      }    
  }
  //console.log((userdataname));
  
  useEffect(() => {
      if(!token)
      {
        //return navigate('/login')
        window.location.href = "/login";
      }
      fetchUserInfo()
  }, [])
  
  useEffect(() => {
    if(socket)
    {
      socket.on('reloadaddemberrequest', (data) => { 
        console.log(data);
      })
    }
  }, [socket])

  return (
    <div>
        <Header loggedInUserdata={userData} />
        <div id="wrapper">
        <div className="content animate-panel dashboard">
            <div className="row">
                <div className="col-lg-12">
                    <h1>
                    Welcome to Chat Panel
                    </h1>
                </div>

            </div>
            </div>
        
        </div>
        <Footer/>
    </div>
  )
}

export default Dashboard