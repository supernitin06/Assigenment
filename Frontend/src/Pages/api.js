// services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000', 
  withCredentials: true,  
});

export const addFriendRequest = (toId) => API.post('/friend/add', { toId });
export const getFriendRequests = () => API.get('/friend/myreq');
export const getSentRequests = () => API.get('/friend/mysentreq');
export const handleFriendRequest = (reqId, responseType) => API.post('/friend/request/handel', { reqId, type: responseType });
