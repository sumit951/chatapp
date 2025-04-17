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