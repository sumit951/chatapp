import React, { useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment'
import axiosConfig,{ BASE_URL } from '../axiosConfig';
import {Link, useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from '../components/Footer';

const Dashboard = ({socket}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('chat-token-info')

  const [userData, setUserData] = useState([]);
  const [addmemberrequest, setAddmemberrequest] = useState([]);

  const logout = async () => {
    await localStorage.removeItem("chat-token-info");
    await localStorage.removeItem("loggedInUserName");
    await localStorage.removeItem("encryptdatatoken");
      navigate('/login')
      //window.location.href = "/login";
  };

    const fetchUserInfo = async () => {
      try {
          const response = await axiosConfig.get('/auth/authenticate')
          if(response.status==200)
          {
              if(response.status !== 200)
              {
                  navigate('/login')
                  //window.location.href = "/login";
              }
              setUserData(response.data[0]);
              
              
          }
      } catch (error) {
          console.log(error.message);
          logout()
          navigate('/login')
      }    
  }
  //console.log((userdataname));
  
  useEffect(() => {
      if(!token)
      {
        navigate('/login')
        //window.location.href = "/login";
      }
      fetchUserInfo()
  }, [])
  
  const fetchAddmemberrequest = async () => {
      try {
          const response = await axiosConfig.get('/user/getaddmemberrequest')
          if(response.status==200)
          {
              //const token = localStorage.getItem(token)
              if(response.status !== 200)
              {
                  navigate('/login')
                  //window.location.href = "/login";
              }   
              setAddmemberrequest(response.data);
          }
      } catch (error) {
        console.log(error.message);
        
      }    
      
  }
  //console.log(alluserdata);
  useEffect(() => {
      fetchAddmemberrequest()
  }, [])


  useEffect(() => {
    if(socket)
    {
      socket.on('reloadaddmemberrequest', (data) => { 
        console.log(data);
        fetchAddmemberrequest()
      })
    }
  }, [socket])

  const handleStatus = async(id,status,groupId,updatedreqnumber) =>{
      try {
          //console.log(id);
          if(!confirm('Please Conifrm')) return false;
          const data = {id:id,status:status,groupId:groupId,updatedreqnumber:updatedreqnumber}
          //console.log(updatedreqnumber);
          
          const response = await axiosConfig.put(`/user/updatestatusaddmemberreq/`,data)
          if(response.status==200)
          {
              if(response.status !== 200)
              {
                  navigate('/login')
                  //window.location.href = "/login";
              } 
              toast.success(response.data.message, {
                  position: "bottom-right",
                  autoClose: 1000,
                  hideProgressBar: true
              });
              fetchAddmemberrequest()
          }
      } catch (error) {
        
          toast.success(response.data.message, {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: true
          });
        
      }  
  }

  return (
    <div>
        <Header loggedInUserdata={userData} />
        <div id="wrapper">
        <div className="content animate-panel dashboard">
            <div className="row">
                <div className="col-lg-12">
                    {/* <h1>
                    Welcome to Chat Panel
                    </h1> */}

                    {(userData.userType == 'ADMIN') ? (
                      <div className="hpanel">
                        <div class="panel-heading row">
                            <div className="col-md-6">
                            <h3>Add Member Requests</h3>
                            </div>
                        </div>
                        <div className="panel-body">
                        <table id="example2" className="table table-bordered " width="100%">
                        <thead>
                        <tr>
                            <th>Group Name</th>
                            <th>Requested By</th>
                            <th>Number of User </th>
                            <th>Status</th>
                            <th>Added On</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            addmemberrequest.map((data,i) => (
                                <tr key={i}>
                                    <td>{data.groupName}</td>
                                    <td>{data.name}</td>
                                    <td>{data.requestNumber}</td>
                                    <td>
                                    {/* {`${data.allowedMember+data.requestNumber}`} */}
                                    {data.requestSts == 'Pending' ? (
                                        <div>
                                        <button class="btn btn-successi" onClick={e=>handleStatus(data.requestId,'Approved',data.groupId,parseInt(data.allowedMember+data.requestNumber))}  title="Approve">Approve <i class="fa fa-check"></i></button>

                                        <button class="btn btn-dangerri m" onClick={e=>handleStatus(data.requestId,'Rejected',data.groupId,parseInt(data.allowedMember+data.requestNumber))} title="Reject">Reject <i class="fa fa-times"></i></button>
                                        </div>
                                    ):(
                                      null
                                    )}
                                    {(data.requestSts=='Approved') ? (<span class="btn btn-successi">{data.requestSts}</span>) : null} 
                                    {(data.requestSts=='Rejected') ? (<span class="btn btn-dangerri m">{data.requestSts}</span>) : null}   
                                    </td>
                                    <td>{moment(data.addedon).format('llll')}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                        </table>

                        </div>
                    </div>
                    ) : ""}
                </div>

            </div>
            </div>
        
        </div>
        <Footer/>
        <ToastContainer />
    </div>
  )
}

export default Dashboard