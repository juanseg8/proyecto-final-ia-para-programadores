import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '../src/screens/HomeScreen';
import { AuthContext } from '../src/AuthContext';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
  useFocusEffect: (cb: () => void) => { cb(); },
}), { virtual: true });

jest.mock('../src/apiClient', () => ({
  apiClient: {
    get: jest.fn().mockResolvedValue({ data: [] }),
  },
}));

describe('HomeScreen', () => {
    it('debe renderizar el saludo y los botones de navegación', async () => {
        const mockAuth = { logout: jest.fn(), user: { email: 'test@test.com', name: 'Juan Perez' } as any, login: jest.fn(), register: jest.fn(), loading: false, isAuthenticated: true, isLoading: false };
        await render(
            <AuthContext.Provider value={mockAuth as any}>
                <HomeScreen />
            </AuthContext.Provider>
        );

        // Verifica saludo personalizado con nombre
        expect(screen.getByText(/Juan/i)).toBeTruthy();

        // Hay dos elementos con este label (card + botón de acciones rápidas), presionamos el primero
        const btns = screen.getAllByLabelText('Ver establecimientos');
        expect(btns.length).toBeGreaterThanOrEqual(1);
        fireEvent.press(btns[0]);
        expect(mockNavigate).toHaveBeenCalledWith('EstablishmentList');
    });

    it('debe mostrar botón de Nuevo establecimiento', async () => {
        const mockAuth = { logout: jest.fn(), user: { email: 'test@test.com' } as any, login: jest.fn(), register: jest.fn(), loading: false, isAuthenticated: true, isLoading: false };
        await render(
            <AuthContext.Provider value={mockAuth as any}>
                <HomeScreen />
            </AuthContext.Provider>
        );

        const newBtn = screen.getByLabelText('Nuevo establecimiento');
        fireEvent.press(newBtn);
        expect(mockNavigate).toHaveBeenCalledWith('EstablishmentForm');
    });
});

