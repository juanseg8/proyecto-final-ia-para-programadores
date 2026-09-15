import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { EstablishmentListScreen } from '../src/screens/EstablishmentListScreen';
import { apiClient } from '../src/apiClient';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}), { virtual: true });

// Mock api client
jest.mock('../src/apiClient', () => ({
    apiClient: {
        get: jest.fn()
    }
}));

describe('EstablishmentListScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty state when there are no establishments', async () => {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });

        await render(<EstablishmentListScreen />);
        
        await waitFor(() => {
            expect(screen.getByText('No tienes establecimientos')).toBeTruthy();
        });
    });

    it('should render list of establishments with name and province', async () => {
        const mockData = [
            { id: '1', name: 'La Margarita', province: 'Buenos Aires' },
            { id: '2', name: 'Los Alamos', province: 'Santa Fe' },
        ];
        (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

        await render(<EstablishmentListScreen />);

        await waitFor(() => {
            expect(screen.getByText('La Margarita')).toBeTruthy();
            expect(screen.getByText('Buenos Aires')).toBeTruthy();
            expect(screen.getByText('Los Alamos')).toBeTruthy();
            expect(screen.getByText('Santa Fe')).toBeTruthy();
        });
    });

    it('should navigate to "Nuevo establecimiento"', async () => {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });
        await render(<EstablishmentListScreen />);

        let newBtn: any;
        await waitFor(() => {
            newBtn = screen.getByText('+ Nuevo establecimiento');
        });
        fireEvent.press(newBtn);

        expect(mockNavigate).toHaveBeenCalledWith('NewEstablishment');
    });

    it('should navigate to Detail when pressing an establishment', async () => {
        const mockData = [
            { id: '123', name: 'La Margarita', province: 'Buenos Aires' }
        ];
        (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

        await render(<EstablishmentListScreen />);

        await waitFor(() => {
            const item = screen.getByText('La Margarita');
            fireEvent.press(item);
        });

        expect(mockNavigate).toHaveBeenCalledWith('EstablishmentDetail', { id: '123' });
    });
});
