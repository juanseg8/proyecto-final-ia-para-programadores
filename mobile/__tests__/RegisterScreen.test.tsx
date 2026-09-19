import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { RegisterScreen } from '../src/screens/RegisterScreen';
import { AuthContext } from '../src/AuthContext';

describe('RegisterScreen', () => {
    it('should have spanish labels and not display technical names', async () => {
        await render(
            <AuthContext.Provider value={{ register: jest.fn(), isLoading: false } as any}>
                <RegisterScreen />
            </AuthContext.Provider>
        );

        expect(screen.queryByText('RegisterScreen')).toBeNull();
        
        expect(screen.getByPlaceholderText('Nombre')).toBeTruthy();
        expect(screen.getByPlaceholderText('Correo electrónico')).toBeTruthy();
        expect(screen.getByPlaceholderText('Contraseña')).toBeTruthy();
        expect(screen.getByText('Crear cuenta')).toBeTruthy();
    });

    it('should call register function with correct data', async () => {
        const mockRegister = jest.fn().mockResolvedValue(true);
        
        await render(
            <AuthContext.Provider value={{ register: mockRegister, isLoading: false } as any}>
                <RegisterScreen />
            </AuthContext.Provider>
        );

        await fireEvent.changeText(screen.getByPlaceholderText('Nombre'), 'Pedro');
        await fireEvent.changeText(screen.getByPlaceholderText('Correo electrónico'), ' PEdro@Agro.com ');
        await fireEvent.changeText(screen.getByPlaceholderText('Contraseña'), '12345678');
        await fireEvent.press(screen.getByText('Crear cuenta'));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith('Pedro', ' PEdro@Agro.com ', '12345678');
        });
    });
});
