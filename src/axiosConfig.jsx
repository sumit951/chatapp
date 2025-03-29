// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
//export const BASE_URL = 'http://localhost:3000';
export const BASE_URL = 'https://chatserver-b6go.onrender.com';

const instance = axios.create({
// .. where we make our configurations
    baseURL: BASE_URL
    //baseURL: "https://rapidcollaborate.in/chat-server"
    // baseURL: "https://chatserver-b6go.onrender.com"
});

// Where you would set stuff like your 'Authorization' header, etc ...
const token = localStorage.getItem('chat-token-info')
if(token)
{
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //instance.defaults.headers.common['Content-Type'] = 'multipart/form-data';
}
// Also add/ configure interceptors && all the other cool stuff

//instance.interceptors.request...

export default instance;