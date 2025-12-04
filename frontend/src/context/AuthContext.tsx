import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    permissions: any;
    login: (user: User) => void;
    logout: () => void;
    hasPermission: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [permissions, setPermissions] = useState<any>({});

    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                }

                // Fetch permissions
                try {
                    const perms = await api.permissions.get();
                    setPermissions(perms || {});
                } catch (err) {
                    console.error('Failed to fetch permissions', err);
                }

            } catch (error) {
                console.error('Auth initialization failed', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const hasPermission = (module: string, action: string) => {
        if (!user) return false;
        if (user.role === 'Admin') return true;

        // Handle Agency Manager mapping
        const roleKey = user.role;

        return permissions[roleKey]?.[module]?.[action] === true;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                permissions,
                login,
                logout,
                hasPermission
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
