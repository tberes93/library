import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:8080';

export const api = axios.create({ baseURL });

api.interceptors.request.use(cfg => {
    const t = localStorage.getItem('token');
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
    return cfg;
});

