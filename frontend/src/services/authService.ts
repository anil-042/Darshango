import { User, UserRole } from '../types';
import { initialUsers } from './mockData';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'auth_user_v2';
const USERS_KEY = 'users_v2';

export const authService = {
    /**
     * Login with email and password
     */
    login: async (email: string, password: string): Promise<User> => {
        await delay(800);

        // Load users from storage or use initial
        const storedUsers = localStorage.getItem(USERS_KEY);
        const users: User[] = storedUsers ? JSON.parse(storedUsers) : initialUsers;

        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (user.status !== 'Active') {
            throw new Error('Account is not active');
        }

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
    },

    /**
     * Register a new user
     */
    register: async (userData: Omit<User, 'id' | 'status'>): Promise<User> => {
        await delay(1000);

        const storedUsers = localStorage.getItem(USERS_KEY);
        const users: User[] = storedUsers ? JSON.parse(storedUsers) : initialUsers;

        if (users.some(u => u.email === userData.email)) {
            throw new Error('Email already exists');
        }

        const newUser: User = {
            ...userData,
            id: `USR-${Date.now()}`,
            status: 'Pending', // Default to pending for approval
            password: userData.password // In real app, this would be hashed
        };

        // Auto-approve Viewer role for demo purposes
        if (newUser.role === 'Viewer') {
            newUser.status = 'Active';
        }

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        return newUser;
    },

    /**
     * Verify OTP (Mock)
     */
    verifyOTP: async (email: string, otp: string): Promise<boolean> => {
        await delay(500);
        return otp === '123456'; // Mock OTP
    },

    /**
     * Login with Google (Mock)
     */
    googleLogin: async (): Promise<User> => {
        await delay(1000);
        // Return a mock user
        const user: User = {
            id: 'USR-GOOGLE',
            name: 'Google User',
            email: 'google.user@example.com',
            role: 'Viewer',
            status: 'Active'
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
    },

    /**
     * Logout
     */
    logout: async (): Promise<void> => {
        await delay(300);
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY); // Clear legacy local storage if exists
    },

    /**
     * Get current user from session
     */
    getCurrentUser: (): User | null => {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }
};
