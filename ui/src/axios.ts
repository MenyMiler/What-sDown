import axios from 'axios';
import { AuthService } from './services/authService';

export const createAxiosInstance = (baseUrl: string) => {
    const axiosInstance = axios.create({
        withCredentials: true,
        timeout: 10000,
        baseURL: `/api${baseUrl}`,
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => (error.response?.status === 401 ? AuthService.logout() : Promise.reject(error)),
    );

    return axiosInstance;
};
