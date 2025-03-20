// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    // baseURL: "http://localhost:3000"
    //baseURL: "https://rapidcollaborate.in/chat-server"
    baseURL: "https://chatserver-b6go.onrender.com"
});

// Where you would set stuff like your 'Authorization' header, etc ...
const token = localStorage.getItem('chat-token-info')
if(token)
{
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
// Also add/ configure interceptors && all the other cool stuff

//instance.interceptors.request...

export default instance;