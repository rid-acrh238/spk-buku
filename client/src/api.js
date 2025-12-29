import axios from 'axios';


const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
console.log("🔗 Frontend nembak ke:", baseURL);
// Ganti baseURL sesuai port backend Node.js kamu
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

// Otomatis tempel Token kalau ada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;