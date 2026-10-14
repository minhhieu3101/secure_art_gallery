import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const baseURL = 'http://localhost:3000';

const axiosClient: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let accessToken: string | null = null;
let isRefreshing = false;

type RetryableRequest = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error) => {
        const originalRequest = error.config as RetryableRequest | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url ?? '';

        // Không thử refresh khi login, refresh hoặc logout thất bại.
        if (
            requestUrl.includes('/auth/login') ||
            requestUrl.includes('/auth/refresh') ||
            requestUrl.includes('/auth/logout')
        ) {
            return Promise.reject(error);
        }

        // Chỉ refresh khi có access token và request trả về 401.
        if (error.response?.status !== 401 || !accessToken || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Không thực hiện refresh đồng thời nhiều lần.
        if (isRefreshing) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Dùng axios riêng để tránh chạy lại interceptor.
            const response = await axios.post(
                `${baseURL}/auth/refresh`,
                {},
                {
                    timeout: 10000,
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            const newAccessToken: string | undefined = response.data?.accessToken;

            if (!newAccessToken) {
                throw new Error('Refresh response does not contain accessToken.');
            }

            setAccessToken(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return await axiosClient(originalRequest);
        } catch (refreshError) {
            setAccessToken(null);

            if (window.location.pathname !== '/login') {
                window.location.replace('/login');
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export default axiosClient;
