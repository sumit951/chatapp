import React, { useState, useEffect,useRef } from 'react'
import moment from 'moment'
import axiosConfig,{ BASE_URL } from '../../../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import InputEmoji from 'react-input-emoji'

const Replies = ({socket, parentMessageId}) => {

    const lastMessageRef = useRef(null);
    const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
    const token = localStorage.getItem('chat-token-info')

    const [userPinnedData, setUserPinnedData] = useState([]);
    
    const fetchpinnedmessagehistory = async(parentMessageId) => {
        //console.log(parentMessageId);
        try {
            const response = await axiosConfig.get(`/chat/getpinnedmessagehistory/${parentMessageId}`)
            if(response.status==200)
            {
                if(response.status !== 200)
                {
                    navigate('/login')
                }   
                
            }
            //console.log(response.data);
            
            setUserPinnedData(response.data);
            
        } catch (error) {
            console.log(error.message);
            setUserPinnedData([]);
        }  
    }

    useEffect(() => {
        if(!token)
        {
            navigate('/login')
            //window.location.href = "/login";
        }
        fetchpinnedmessagehistory(parentMessageId)
    }, [parentMessageId])

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ block: "end"});
    }, [userPinnedData]);
    //lastMessageRef.current?.scrollIntoView({ block: "end"});

    useEffect(() => {
        socket.on('reloadpinStatusUpdated', (data) => { 
            /* console.log(data);
            
            if(parentMessageId === data.messageId)
            {
                console.log(data);
                setUserPinnedData([...userPinnedData, data])
            } */
            fetchpinnedmessagehistory(parentMessageId)
        })
    }, [socket,parentMessageId,userPinnedData]);
    
  return (
    <>
        
        {userPinnedData.length>0 && <div className="modal-body">
            
            <ul>
            {userPinnedData.map((PinnedData) =>
            (PinnedData.pinId!=null) ? (
            PinnedData.username === localStorage.getItem('loggedInUserName') ? (
                <li className={`deletedmsg`}
                key={PinnedData.pinId}
                
                >
                <p> 
                {PinnedData.pinSts =='Yes' ? (
                <>
                <span>You pinned a message. {moment(PinnedData.timestamp).format('llll')}</span>
                </>
                ) : (
                <>
                <span>You unpinned a message. {moment(PinnedData.timestamp).format('llll')}</span>
                </> 
                )}  
                </p>

                </li>
             ) : (
                <li className={`deletedmsg`}  key={PinnedData.pinId}>
                <p>
                {PinnedData.pinSts =='Yes' ? (
                <>
                <span>{PinnedData.username} pinned a message. {moment(PinnedData.timestamp).format('llll')}</span>
                </>
                ) : (
                <>
                <span>{PinnedData.username} unpinned a message. {moment(PinnedData.timestamp).format('llll')}</span>
                </> 
                )} 
                </p>
                </li>
            )) : ( <b></b> )
            )}
            </ul>
        </div>
        }
    </>
  )
}

export default Replies