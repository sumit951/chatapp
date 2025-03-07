import React, { useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axiosConfig from '../../axiosConfig';
import {Link, useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from '../../components/Footer';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';

//DataTable.use(DT);

const Manageuser = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('chat-token-info')
    const [userData, setUserData] = useState([]);
    const [alluserdata, setAllUserdata] = useState([]);
    
    const fetchUserInfo = async () => {
        try {
            const response = await axiosConfig.get('/auth/authenticate')
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    navigate('/login')
                }   
                setUserData(response.data[0]);
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

    const fetchAllUser = async () => {
        try {
            const response = await axiosConfig.get('/user/getalluser')
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    //navigate('/login')
                    window.location.href = "/login";
                }   
                setAllUserdata(response.data);
            }
        } catch (error) {
           console.log(error.message);
           
        }    
        
    }
    //console.log(alluserdata);
    useEffect(() => {
        if(!token)
        {
            //return navigate('/login')
            window.location.href = "/login";
        }
        fetchAllUser()
    }, [])

    const handleDelete = async(id) =>{
        try {
            //console.log(id);
            if(!confirm('Please Conifrm')) return false;
            const response = await axiosConfig.delete(`/user/deleteuser/${id}`)
            if(response.status==200)
            {
                //const token = localStorage.getItem(token)
                if(response.status !== 200)
                {
                    //navigate('/login')
                    window.location.href = "/login";
                } 
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                });
                setAllUserdata(alluserdata.filter((row => row.id !== id)));
            }
        } catch (error) {
           //console.log(error.message);
           toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
            });
           
        }  
    }

    const handleStatus = async(id,status) =>{
        try {
            //console.log(id);
            const data = {id:id,status:status}
            const response = await axiosConfig.put(`/user/updatestatus/`,data)
            if(response.status==200)
            {
                if(response.status !== 200)
                {
                    window.location.href = "/login";
                } 
                toast.success(response.data.message, {
                    position: "bottom-right",
                    autoClose: 1000,
                });
                fetchAllUser()
            }
        } catch (error) {
           
            toast.success(response.data.message, {
                position: "bottom-right",
                autoClose: 1000,
            });
           
        }  
    }
    
  return (
    <div>
        
        <Header  loggedInUserdata={userData} />
        <div id="wrapper">
        <div className="content animate-panel">
            <div className="row">
                <div className="col-lg-12">
                    <div className="hpanel">
                        <div class="panel-heading row">
                            <div className="col-md-6">
                            <h3>Manage User</h3>
                            </div>
                            <div className="col-md-6">
                            <Link to="/adduser" className="btn btn-success float-end mt-10"> 
                            <span>
                                Add User
                            </span>
                            </Link>
                            </div>
                        </div>
                        <div className="panel-body">
                        <table id="example2" className="table table-striped table-bordered table-hover" width="100%">
                        <thead>
                        <tr>
                            <th>Employee Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Password</th>
                            <th>Added On</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            alluserdata.map((data,i) => (
                                <tr key={i}>
                                    <td>{data.employeeId}</td>
                                    <td>{data.name}</td>
                                    <td>{data.email}</td>
                                    <td>{data.userType}</td>
                                    <td>{data.decryptPassword}</td>
                                    <td>{data.addedon}</td>
                                    <td>
                                    {data.status == 'Active' ? (
                                        <button class="btn btn-success" onClick={e=>handleStatus(data.id,'Inactive')}  title="Active"><i class="fa fa-check"></i></button>
                                    ):(
                                        <button class="btn btn-danger" onClick={e=>handleStatus(data.id,'Active')} title="Inactive"><i class="fa fa-times"></i></button>
                                    )}
                                        
                                    </td>
                                    <td>
                                        <Link to={`/updateuser/${data.id}`} className="btn btn-warning"><i className='fa fa-pencil'></i></Link>
                                        <a onClick={e=>handleDelete(data.id)} className="btn btn-danger ms-2"><i className='fa fa-trash'></i></a>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                        </table>

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

export default Manageuser