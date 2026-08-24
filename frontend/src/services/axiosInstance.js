import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.18.115:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

export default axiosInstance;