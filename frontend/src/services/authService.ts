import axiosInstance from './axiosInstance';
import { User } from '../types';

const STORAGE_KEY = 'auth_user_v2';
const TOKEN_KEY = 'auth_token';

export const authService = {
    /**
     * Login with email and password
     */
    login: async (email: string, password: string): Promise<User> => {
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            const { token, user } = response.data;

            if (token) {
                localStorage.setItem(TOKEN_KEY, token);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            }
            return user;
        } catch (error: any) {
            console.error('Auth Service Login Error:', error);
            if (error.response) {
                // Server responded with a status code outside 2xx
                throw new Error(`Server Error: ${error.response.status} - ${error.response.data?.message || JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                // Request was made but no response received
                throw new Error('Network Error: No response from server. Check if backend is running on port 5001.');
            } else {
                // Something happened in setting up the request
                throw new Error(`Request Error: ${error.message}`);
            }
        }
    },

    /**
     * Register a new user
     */
    register: async (userData: any): Promise<User> => {
        try {
            const response = await axiosInstance.post('/auth/signup', userData);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    /**
     * Verify OTP (Mock - keep as mock for now if backend doesn't support it)
     */
    verifyOTP: async (email: string, otp: string): Promise<boolean> => {
        return otp === '123456';
    },

    /**
     * Login with Google (Mock - keep as mock for now)
     */
    googleLogin: async (): Promise<User> => {
        // TODO: Implement real Google Login
        const user: User = {
            id: 'USR-GOOGLE',
            name: 'Google User',
            email: 'google.user@example.com',
            role: 'Viewer',
            status: 'Active'
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
    },

    /**
     * Logout
     */
    logout: async (): Promise<void> => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
    },

    /**
     * Get current user from storage
     */
    getCurrentUser: (): User | null => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }
};
