import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../src/AuthContext';
import { Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../src/apiClient';
import MockAdapter from 'axios-mock-adapter';

jest.mock('expo-secure-store');

const DummyComponent = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    if (isLoading) return <Text>Loading...</Text>;
    if (isAuthenticated) return (
        <View>
            <Text testID="auth-status">Authenticated</Text>
            <Text testID="user-email">{user?.email}</Text>
        </View>
    );
    return <Text testID="auth-status">Unauthenticated</Text>;
};

describe('AuthProvider F01', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(apiClient);
        jest.clearAllMocks();
    });

    afterEach(() => {
        mock.restore();
    });

    it('should show loading initially and remain unauthenticated if no token in SecureStore', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
        
        await render(
            <AuthProvider>
                <DummyComponent />
            </AuthProvider>
        );

        expect(screen.getByText('Loading...')).toBeTruthy();
        
        await waitFor(() => {
            expect(screen.getByTestId('auth-status').props.children).toBe('Unauthenticated');
        });
    });

    it('should restore session and set user if valid token exists and /auth/me succeeds', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
            if (key === 'accessToken') return Promise.resolve('valid-token');
            return Promise.resolve(null);
        });

        mock.onGet('/auth/me').reply(200, {
            id: 1, email: 'pedro@agro.com'
        });

        await render(
            <AuthProvider>
                <DummyComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status').props.children).toBe('Authenticated');
            expect(screen.getByTestId('user-email').props.children).toBe('pedro@agro.com');
        });
    });

    it('should clear session if /auth/me fails during restore session', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
            if (key === 'accessToken') return Promise.resolve('expired-or-invalid-token');
            return Promise.resolve(null);
        });

        mock.onGet('/auth/me').reply(401);

        await render(
            <AuthProvider>
                <DummyComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status').props.children).toBe('Unauthenticated');
        });
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('accessToken');
    });
});
