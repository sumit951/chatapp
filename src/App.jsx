import React, { useState, useEffect, useRef, useMemo } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
//import '@fortawesome/fontawesome-free/css/all.css';

import { BrowserRouter, Routes, Route } from "react-router-dom"
import axiosConfig, { BASE_URL } from './axiosConfig';
import { getToken } from 'firebase/messaging';
import { messaging } from './firebase-config';
import { onMessage } from 'firebase/messaging';
import { ToastContainer, toast } from 'react-toastify';

import Login from "./pages/Login";
import Createpassword from "./pages/Createpassword";
import Dashboard from "./pages/Dashboard";
import Adduser from "./pages/users/Adduser";
import Manageuser from "./pages/users/Manageuser";
import Updateuser from "./pages/users/Updateuser";
import Chatboard from "./pages/users/chatconsoleview/Chatboard";

import Chat from "./pages/chatconsole/Chat";
import socketIO from 'socket.io-client';


const socket = socketIO.connect(`${BASE_URL}`);

/* const socket = socketIO.connect(`${BASE_URL}`, {
  path: '/chat-server/socket.io', 
}); */

function App() {
  /*FCM notification*/
  const [permissionGranted, setPermissionGranted] = useState(false);
  const chatboardUserid = atob(localStorage.getItem('encryptdatatoken'))
 
  const requestPermission = async () => {
    try {
      const permission = Notification.permission;
  
      if (permission === 'granted') {
        console.log('Notification permission already granted.');
  
        if ('serviceWorker' in navigator) {
          // Register the service worker
          const registration = await navigator.serviceWorker
            .register('/chat-app/firebase-messaging-sw.js')
            .then((registration) => {
              console.log('Service Worker registered with scope:', registration.scope);
              return registration;
            })
            .catch((error) => {
              console.error('Service Worker registration failed:', error);
              return null;
            });
  
          if (!registration) return;
  
          // Get FCM token using the registered service worker
          const currentToken = await getToken(messaging, {
            vapidKey: 'BNowVgygmaSSo_MLpMbYZDTapAU-lf70k7Df7KBoWMESkXHBxPotU6-eExTusH4Xdf7yKvUWKHy9PJYeNfvHHZ8',
            serviceWorkerRegistration: registration,
          });
  
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            const requestData = {
              userId: chatboardUserid,
              fcmtoken: currentToken,
            };
  
            try {
              const response = await axiosConfig.put('/user/updatefcmtoken', requestData);
              if (response.status === 200) {
                console.log(response);
              }
            } catch (error) {
              console.error('Error saving FCM token:', error.message);
            }
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        } else {
          console.error('Service Workers are not supported in this browser.');
        }
  
      } else if (permission === 'default') {
        const permissionRequest = await Notification.requestPermission();
        if (permissionRequest === 'granted') {
          console.log('Notification permission granted.');
          setPermissionGranted(true);
          requestPermission(); // Re-run after permission granted
        } else {
          console.log('Notification permission denied.');
        }
      } else {
        console.log('Notification permission denied.');
      }
  
    } catch (error) {
      console.error('Error during notification setup:', error);
    }
  };
  /*FCM notification*/

  
  useEffect(() => {
    requestPermission();
  }, [])

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload.notification.body);  // Check this log to see the incoming message
      if (payload && payload.notification) {
        // Handle the notification payload data as needed
        //toast(payload.notification.body);
        toast.success(payload.notification.title+' : '+payload.notification.body, {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true
        });
      }
    });
  }, [messaging])



  return (
    <BrowserRouter basename="/chat-app">
      <Routes>
        <Route path="/login" element={<Login socket={socket} />}></Route>
        <Route path="/createpassword/:id/:verify" element={<Createpassword />}></Route>

        <Route path="/" element={<Dashboard socket={socket} />}></Route>
        <Route path="/dashboard" element={<Dashboard socket={socket} />}></Route>
        <Route path="/manageuser" element={<Manageuser />}></Route>
        <Route path="/adduser" element={<Adduser />}></Route>
        <Route path="/updateuser/:id/" element={<Updateuser />}></Route>
        <Route path="/Chatboard/:id/" element={<Chatboard />}></Route>

        <Route path="/chatconsole/spaces" element={<Chat socket={socket} />}></Route>
        <Route path="/chatconsole/spaces/:boardtype/:boardid" element={<Chat socket={socket} />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
