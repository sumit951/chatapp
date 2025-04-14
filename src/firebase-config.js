// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken  } from "firebase/messaging";
 
const firebaseConfig = {
  apiKey: "AIzaSyCLf7bGfYF4aJc2A-qI5o3h44HRwG8DPeE",
  authDomain: "chat-panel-253c1.firebaseapp.com",
  projectId: "chat-panel-253c1",
  storageBucket: "chat-panel-253c1.firebasestorage.app",
  messagingSenderId: "1020863783278",
  appId: "1:1020863783278:web:9ba789708414df3e00a17f",
  measurementId: "G-078H78JT4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const messaging = getMessaging(app);

export const messaging = getMessaging(app);
/* export const generateToken = async() => {
  const permission =  await Notification.requestPermission();
  //console.log(permission);
  if(permission === "granted")
  {
    const fcmToken =  await getToken(messaging, 
      {vapidKey: "BNowVgygmaSSo_MLpMbYZDTapAU-lf70k7Df7KBoWMESkXHBxPotU6-eExTusH4Xdf7yKvUWKHy9PJYeNfvHHZ8"}
    );
    return fcmToken;
  }
}; */

onMessage(messaging, (payload) => {
    console.log('Message received. ', payload.notification.body);  // Check this log to see the incoming message
    /* if (payload && payload.notification) {
    // Handle the notification payload data as needed
    //toast(payload.notification.body);
    toast.success(payload.notification.body, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true
    });
    //alert(payload.data.google.c.a.c_l)
    } */
});