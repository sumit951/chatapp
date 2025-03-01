import React, { useState, useEffect} from 'react'
import axiosConfig from '../axiosConfig';
import {Link, useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from '../components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('chat-token-info')
  const [userdataname, setUserdataname] = useState([]);

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
              
              
          }
      } catch (error) {
          console.log(error.message);
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
  return (
    <div>
        <Header name={userdataname}/>
        <div id="wrapper">
        <div className="content animate-panel">
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