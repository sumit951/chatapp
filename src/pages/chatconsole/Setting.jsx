import React, { useState, useEffect} from 'react'
import axiosConfig from '../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';

const Setting = ({loggedInuserdata}) => {
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))

    const [status, setStatus] = useState('');
    const [time, setTime] = useState(''); // Default time is 30 minutes
    
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        // Reset time when status changes
    };

    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            chatBusyDndstatus:status,
            chatBusyDndTime: parseInt(time),
        };

        console.log(time);
        console.log(status);
        
        if(status=='')
        {
          alert('Select one option!')
          return false;
          
        }
        else if(time=='')
        {
            alert('Select Duration!')
            return false;
            
        }
        else
        {
            console.log(data);
            //return false;
         
            try {
              const response = await axiosConfig.put(`/user/updatesetting`, data)
              if(response.status==200 && response.data.status=='success')
              {
                  toast.success(response.data.message, {
                      position: "bottom-right",
                      autoClose: 1000,
                      hideProgressBar: true
                  });
                    setTimeout(() => {
                          //navigate('/manageuser');
                        //window.location.reload()
                    }, 
                    2000
                    ); 
              }
              if(response.data.status=='fail')
              {
                  toast.error(response.data.message, {
                      position: "bottom-right",
                      autoClose: 1000,
                      hideProgressBar: true
                  });
              }
          } catch (error) {
              //console.log(error.message);
              toast.error(error.message, {
                  position: "bottom-right",
                  autoClose: 1000,
                  hideProgressBar: true
              });
          }
        }
    }

    /* let currentTime = new Date();

    // Add 30 minutes (30 * 60 * 1000 milliseconds)
    currentTime.setMinutes(currentTime.getMinutes() + 30);

    // Output the updated time
    console.log(currentTime);
    const currentTime2 = new Date().getTime();
    const expiryTime = new Date('Sat Mar 29 2025 13:10:04').getTime() + 60000; // expiry time in milliseconds (60 seconds)
    if (currentTime2 >= expiryTime) {
        console.log('timeexpired');
    }
    console.log(expiryTime);
    console.log(currentTime2);
    //console.log(loggedInuserdata); */
    
  return (
    <>
        <div className="modal-body">
            <div className="msg-body">
        <div class="content animate-panel">
        <div class="row d-flex justify-content-center">
        <div class="col-lg-7 mt-5">
            <div class="hpanel">
                <div class="panel-heading text-center">
                    <h3>Setting</h3>
                </div>
                <div class="panel-body">
                <form onSubmit={handleSubmit} class="form-horizontal p-3 border rounded">
                <div class="form-group">
                    <div class="col-sm-9">
                    <label>
                    <input
                        type="radio"
                        name="status"
                        value="BUSY"
                        checked={status === 'BUSY'}
                        onChange={handleStatusChange}
                        
                    /> <span style={{ marginLeft: '10px' }}>Busy</span>
                    </label>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-9">
                    <label>
                    <input
                        type="radio"
                        name="status"
                        value="DND"
                        checked={status === 'DND'}
                        onChange={handleStatusChange}
                    /> <span style={{ marginLeft: '10px' }}>Do Not Disturb (DND)</span>
                    </label>
                    </div>
                </div>

                {status && <div class="form-group mb-0">
                    <div class="col-sm-12">
                    <label>
                        Time Selection:
                        <select className="form-control" onChange={handleTimeChange}>
                            <option value="">Select Duration</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="120">2 hours</option>
                        </select>
                    </label>
                    </div>
                    <div class="col-sm-12">&nbsp;</div>
                    {time && <div class="col-sm-12">
                    {status === 'BUSY' ? (
                    <p class="alert alert-warning">You are busy for {time} minutes.</p>
                    ) : (
                    <p class="alert alert-danger">You are in Do Not Disturb (DND) mode for {time} minutes.</p>
                    )}
                    </div>}
                </div>}
                
                <div class="form-group mb-1 mt-2">
                    <div class="col-sm-12 d-flex justify-content-end mt-1">
                        <button class="btn btn-success btn-block" type="submit">Save changes <i class="fa fa-chevron-right"></i></button>
                    </div>
                </div>
                </form>
                </div>
            </div>
        </div>
        </div>    
        </div>
        
            </div>
        </div>
        <ToastContainer />
    </>
  )
}

export default Setting