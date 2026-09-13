import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { LoginScreen } from '../src/screens/LoginScreen';
import { AuthContext } from '../src/AuthContext';

describe('LoginScreen', () => {
    it('should call login function with email and password when submit button is pressed', async () => {
        const mockLogin = jest.fn().mockResolvedValue(true);
        
        await render(
            <AuthContext.Provider value={{ login: mockLogin, isLoading: false } as any}>
                <LoginScreen />
            </AuthContext.Provider>
        );

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Login');

        await fireEvent.changeText(emailInput, 'test@test.com');
        await fireEvent.changeText(passwordInput, 'password123');
        await fireEvent.press(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
        });
        await new Promise(r => setTimeout(r, 0));
    });

    it('should display error message on login failure', async () => {
        const mockLogin = jest.fn().mockRejectedValue(new Error('Credenciales inválidas'));
        
        await render(
            <AuthContext.Provider value={{ login: mockLogin, isLoading: false } as any}>
                <LoginScreen />
            </AuthContext.Provider>
        );

        await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'wrong@test.com');
        await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'badpass');
        await fireEvent.press(screen.getByText('Login'));

        const errorText = await screen.findByText('Credenciales inválidas');
        expect(errorText).toBeTruthy();
    });
});
