import axios from 'axios';

// Ganti baseURL sesuai port backend Node.js kamu
const api = axios.create({
    baseURL: 'http://localhost:5000',
});

// Otomatis tempel Token kalau ada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;