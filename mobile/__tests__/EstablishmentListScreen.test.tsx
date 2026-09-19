import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { apiClient } from '../src/apiClient';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useFocusEffect: jest.fn((cb) => {
    const React = require('react');
    React.useEffect(() => {
      const cleanupFn = cb();
      return typeof cleanupFn === 'function' ? cleanupFn : undefined;
    }, [cb]);
  }),
}));

jest.mock('../src/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const { EstablishmentListScreen } = require('../src/screens/EstablishmentListScreen');

describe('EstablishmentListScreen', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the correct title "Mis establecimientos"', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    const view = await render(<EstablishmentListScreen />);
    await waitFor(() => {
      expect(view.getByRole('header', { name: 'Mis establecimientos' })).toBeTruthy();
    });
  });

  it('should render empty state component in Spanish when there are no establishments', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    const view = await render(<EstablishmentListScreen />);
    await waitFor(() => {
      expect(view.getByText('Tu campo empieza acá')).toBeTruthy();
    });
  });

  it('should render list of establishments displaying "Localidad, Provincia" and "ha"', async () => {
    const mockData = [
      { id: '1', name: 'La Margarita', locality: 'Pergamino', province: 'Buenos Aires', superficieHa: 1500 },
      { id: '2', name: 'Los Alamos', locality: 'Venado Tuerto', province: 'Santa Fe', superficieHa: 800 },
    ];
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockData });
    const view = await render(<EstablishmentListScreen />);
    await waitFor(() => {
      expect(view.getByText('Pergamino, Buenos Aires')).toBeTruthy();
      expect(view.getByText('Venado Tuerto, Santa Fe')).toBeTruthy();
      expect(view.getByText('1500 ha')).toBeTruthy();
      expect(view.getByText('800 ha')).toBeTruthy();
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
      },
    });
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [proxyData] });
    const view = await render(<EstablishmentListScreen />);
    await waitFor(() => {
      expect(view.getByText('El ombu')).toBeTruthy();
    });
  });

  it('should use accessible roles for buttons and navigate correctly', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    const view = await render(<EstablishmentListScreen />);
    let buttons: any[] = [];
    await waitFor(() => {
      buttons = view.getAllByLabelText('Agregar establecimiento');
      expect(buttons.length).toBeGreaterThan(0);
    });
    fireEvent.press(buttons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('EstablishmentForm');
  });

  it('should navigate to Detail when pressing an establishment card using accessible button role', async () => {
    const mockData = [
      { id: '123', name: 'La Margarita', locality: 'Pergamino', province: 'Buenos Aires', superficieHa: 1500 },
    ];
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockData });
    const view = await render(<EstablishmentListScreen />);
    let itemBtn: any;
    await waitFor(() => {
      itemBtn = view.getByRole('button', { name: /la margarita/i });
      expect(itemBtn).toBeTruthy();
    });
    fireEvent.press(itemBtn);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('EstablishmentDetail', { id: '123' });
    });
  });
});
