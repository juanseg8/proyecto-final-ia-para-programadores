import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { HomeScreen } from '../src/screens/HomeScreen';
import { AuthContext } from '../src/AuthContext';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}), { virtual: true });

describe('HomeScreen', () => {
    it('should render navigate to "Mis establecimientos" button and navigate on press', async () => {
        const mockAuth = { logout: jest.fn(), user: { email: 'test@test.com' } as any, login: jest.fn(), register: jest.fn(), loading: false, isAuthenticated: true, isLoading: false };
        await render(
            <AuthContext.Provider value={mockAuth as any}>
                <HomeScreen />
            </AuthContext.Provider>
        );

        const btn = screen.getByText('Mis establecimientos');
        fireEvent.press(btn);

        expect(mockNavigate).toHaveBeenCalledWith('EstablishmentList');
    });
});
