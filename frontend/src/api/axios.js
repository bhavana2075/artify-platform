import axios from 'axios';

const API = axios.create({
  baseURL: 'https://artify-platform-backend.onrender.com/api',
});

export default API;
