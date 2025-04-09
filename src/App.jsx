import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
//import '@fortawesome/fontawesome-free/css/all.css';

import {BrowserRouter, Routes, Route} from "react-router-dom"
import axiosConfig,{ BASE_URL } from './axiosConfig';

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
  
  return (
    <BrowserRouter basename="/chat-app/">
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
