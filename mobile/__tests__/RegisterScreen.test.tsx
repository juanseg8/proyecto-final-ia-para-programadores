import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { RegisterScreen } from '../src/screens/RegisterScreen';
import { AuthContext } from '../src/AuthContext';

describe('RegisterScreen', () => {
    it('should call register function with correct data', async () => {
        const mockRegister = jest.fn().mockResolvedValue(true);
        
        await render(
            <AuthContext.Provider value={{ register: mockRegister, isLoading: false } as any}>
                <RegisterScreen />
            </AuthContext.Provider>
        );

        await fireEvent.changeText(screen.getByPlaceholderText('Name'), 'Pedro');
        await fireEvent.changeText(screen.getByPlaceholderText('Email'), ' PEdro@Agro.com ');
        await fireEvent.changeText(screen.getByPlaceholderText('Password'), '12345678');
        await fireEvent.press(screen.getByText('Register'));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith('Pedro', ' PEdro@Agro.com ', '12345678');
        });
    });
});
