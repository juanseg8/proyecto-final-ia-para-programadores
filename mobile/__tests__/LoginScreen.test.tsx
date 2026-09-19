import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { LoginScreen } from '../src/screens/LoginScreen';
import { AuthContext } from '../src/AuthContext';

describe('LoginScreen', () => {
    it('should have spanish labels and not display technical names', async () => {
        await render(
            <AuthContext.Provider value={{ login: jest.fn(), isLoading: false } as any}>
                <LoginScreen onGoToRegister={jest.fn()} />
            </AuthContext.Provider>
        );

        expect(screen.queryByText('LoginScreen')).toBeNull();
        expect(screen.getByPlaceholderText('Correo electronico')).toBeTruthy();
        expect(screen.getByPlaceholderText('Contrasena')).toBeTruthy();
        // Buscar botón por role + texto parcial
        expect(screen.getByRole('button', { name: /iniciar/i })).toBeTruthy();
    });

    it('should call login function with email and password when submit button is pressed', async () => {
        const mockLogin = jest.fn().mockResolvedValue(true);
        
        await render(
            <AuthContext.Provider value={{ login: mockLogin, isLoading: false } as any}>
                <LoginScreen onGoToRegister={jest.fn()} />
            </AuthContext.Provider>
        );

        const emailInput = screen.getByPlaceholderText('Correo electronico');
        const passwordInput = screen.getByPlaceholderText('Contrasena');
        const submitButton = screen.getByRole('button', { name: /iniciar/i });

        await fireEvent.changeText(emailInput, 'test@test.com');
        await fireEvent.changeText(passwordInput, 'password123');
        await fireEvent.press(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
        });
        await new Promise(r => setTimeout(r, 0));
    });

    it('should display error message on login failure', async () => {
        const mockLogin = jest.fn().mockRejectedValue(new Error('Credenciales invalidas'));
        
        await render(
            <AuthContext.Provider value={{ login: mockLogin, isLoading: false } as any}>
                <LoginScreen onGoToRegister={jest.fn()} />
            </AuthContext.Provider>
        );

        await fireEvent.changeText(screen.getByPlaceholderText('Correo electronico'), 'wrong@test.com');
        await fireEvent.changeText(screen.getByPlaceholderText('Contrasena'), 'badpass');
        await fireEvent.press(screen.getByRole('button', { name: /iniciar/i }));

        const errorText = await screen.findByText('Credenciales invalidas');
        expect(errorText).toBeTruthy();
    });
});

