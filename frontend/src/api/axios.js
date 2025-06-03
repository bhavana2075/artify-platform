import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://artify-platform-backend.onrender.com/api',
});

const user = JSON.parse(localStorage.getItem('user'));
const token = user?.token;

if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;
