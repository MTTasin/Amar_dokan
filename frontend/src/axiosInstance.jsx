import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Your Django backend URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default axiosInstance;
