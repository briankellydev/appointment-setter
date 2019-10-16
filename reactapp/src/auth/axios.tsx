import axios from 'axios';

// Set config defaults when creating the instance
export const http = axios.create({
    baseURL: 'https://https://appointment-setter-bk.herokuapp.com/api'
});

http.interceptors.request.use((config) => {
    config.headers['x-auth-token'] = localStorage.getItem('x-auth-token');
    return config;
});

http.interceptors.response.use((config) => {
    localStorage.setItem('x-auth-token', config.headers['x-auth-token']);
    return config;
}, (error) => {
    if (error.status === 401) {
        localStorage.removeItem('x-auth-token');
        window.location.href = '/';
    }
    return Promise.reject(error);
});

export default http;