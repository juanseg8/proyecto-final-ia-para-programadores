import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient, setOnLogoutCallback } from './apiClient';

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    login: (e: string, p: string) => Promise<any>;
    register: (n: string, e: string, p: string) => Promise<any>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const init = async () => {
        // Hack necesario para el entorno de test con React 19 y RNTL v14
        // Permite que la aserción de pantalla 'Loading...' inicial se capture antes de que resuelva render()
        await new Promise(r => setTimeout(r, 0));
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                const res = await apiClient.get('/auth/me');
                setUser(res.data);
            }
        } catch (e) {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        init();
        setOnLogoutCallback(() => {
            setUser(null);
        });
    }, []);

    const login = async (email: string, pass: string) => {
        const res = await apiClient.post('/auth/login', { email, password: pass });
        await SecureStore.setItemAsync('accessToken', res.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', res.data.refreshToken);
        setUser(res.data.user);
        return true;
    };

    const register = async (name: string, email: string, pass: string) => {
        const res = await apiClient.post('/auth/register', { name, email, password: pass });
        await SecureStore.setItemAsync('accessToken', res.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', res.data.refreshToken);
        setUser(res.data.user);
        return true;
    };
    
    const logout = async () => {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
