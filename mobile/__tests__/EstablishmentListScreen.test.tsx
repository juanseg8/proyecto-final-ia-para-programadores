import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { apiClient } from '../src/apiClient';

// Mock navigation BEFORE importing the screen so hooks resolve to the mocked implementation.
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useFocusEffect: jest.fn((cb) => { require('react').useEffect(cb, []); }),
}));

jest.mock('../src/apiClient', () => ({
  apiClient: {
    get: jest.fn()
  }
}));

const { EstablishmentListScreen } = require('../src/screens/EstablishmentListScreen');

describe('EstablishmentListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the correct title "Mis establecimientos"', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    render(<EstablishmentListScreen />);

    await waitFor(() => {
      expect(screen.getByRole('header', { name: 'Mis establecimientos' })).toBeTruthy();
    });
  });

  it('should render empty state component in Spanish when there are no establishments', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    render(<EstablishmentListScreen />);

    await waitFor(() => {
      expect(screen.getByText('Tu campo empieza acá')).toBeTruthy();
    });
  });

  it('should render list of establishments displaying "Localidad, Provincia" and "ha"', async () => {
    const mockData = [
      { id: '1', name: 'La Margarita', locality: 'Pergamino', province: 'Buenos Aires', superficieHa: 1500 },
      { id: '2', name: 'Los Alamos', locality: 'Venado Tuerto', province: 'Santa Fe', superficieHa: 800 },
    ];
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(<EstablishmentListScreen />);

    await waitFor(() => {
      expect(screen.getByText('Pergamino, Buenos Aires')).toBeTruthy();
      expect(screen.getByText('Venado Tuerto, Santa Fe')).toBeTruthy();
      expect(screen.getByText('1500 ha')).toBeTruthy();
      expect(screen.getByText('800 ha')).toBeTruthy();
    });
  });

  it('should not attempt to read imageUrl from DTO mock (Prohibición de fotos de BD)', async () => {
    const rawData = { id: '3', name: 'El ombu', locality: 'Rojas', province: 'Buenos Aires', superficieHa: 100 };

    const proxyData = new Proxy(rawData, {
      get(target: any, prop: string) {
        if (prop === 'imageUrl') {
          throw new Error('Contract violation: Component attempted to read imageUrl from DTO');
        }
        return target[prop];
      }
    });

    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [proxyData] });
    render(<EstablishmentListScreen />);

    await waitFor(() => {
      expect(screen.getByText('El ombu')).toBeTruthy();
    });
  });

  it('should use accessible roles for buttons and navigate correctly', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    render(<EstablishmentListScreen />);

    let newBtn: any;
    await waitFor(() => {
      const btns = screen.getAllByLabelText('Agregar establecimiento');
      newBtn = btns[0];
    });
    fireEvent.press(newBtn);

    expect(mockNavigate).toHaveBeenCalledWith('EstablishmentForm');
  });

  it('should navigate to Detail when pressing an establishment card using accessible button role', async () => {
    const mockData = [
      { id: '123', name: 'La Margarita', locality: 'Pergamino', province: 'Buenos Aires', superficieHa: 1500 }
    ];
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(<EstablishmentListScreen />);

    let itemBtn: any;
    await waitFor(() => {
      itemBtn = screen.getByRole('button', { name: /la margarita/i });
    });
    fireEvent.press(itemBtn);

    expect(mockNavigate).toHaveBeenCalledWith('EstablishmentDetail', { id: '123' });
  });
});
