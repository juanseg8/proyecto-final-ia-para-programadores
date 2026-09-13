import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const apiClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

let onLogoutCallback: (() => void) | null = null;
export const setOnLogoutCallback = (cb: () => void) => {
    onLogoutCallback = cb;
};

apiClient.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (originalRequest.url === '/auth/refresh') {
            return Promise.reject(error);
        }
        
        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        
        return new Promise(function (resolve, reject) {
            apiClient.post('/auth/refresh', { refreshToken })
                .then(async ({ data }) => {
                    await SecureStore.setItemAsync('accessToken', data.accessToken);
                    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
                    apiClient.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    processQueue(null, data.accessToken);
                    resolve(apiClient(originalRequest));
                })
                .catch(async (err) => {
                    processQueue(err, null);
                    await SecureStore.deleteItemAsync('accessToken');
                    await SecureStore.deleteItemAsync('refreshToken');
                    delete apiClient.defaults.headers.common['Authorization'];
                    if (onLogoutCallback) onLogoutCallback();
                    reject(err);
                })
                .finally(() => {
                    isRefreshing = false;
                });
        });
    }
    return Promise.reject(error);
});
