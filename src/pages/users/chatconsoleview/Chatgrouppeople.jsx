import React, { useState, useEffect} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

import axiosConfig from '../../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faChartBar, faSignOutAlt, faUsers, faUser, faPowerOff} from '@fortawesome/free-solid-svg-icons';

const Chatgrouppeople = ({groupMemberdataFromChild}) => {


    return (
        <>
            <div className="row">
                <div className='col-5 p-4'>
                    <div className="chat-list border rounded">
                    {groupMemberdataFromChild.map((user,i) => (
                        <div className='row'>
                        <div className='col-10'>   
                        <a key={user.socketID}
                            className="d-flex align-items-center p-2">
                            <div className="flex-shrink-0">
                                <span className="shortName">{user.usershortName}</span>
                                {user.socketID && <span className="active"></span>}
                            </div>
                            <div className="flex-grow-1 ms-2 w-90">
                                <h3>{user.userName}</h3>
                                <h6>{user.userEmail}</h6>
                            </div>
                            
                        </a>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
               
            </div>
            <ToastContainer />
        </>
    )
}

export default Chatgrouppeople