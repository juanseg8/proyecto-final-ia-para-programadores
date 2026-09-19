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

    const view = render(<EstablishmentListScreen />);

    expect(
      await view.findByRole('header', { name: 'Mis establecimientos' })
    ).toBeTruthy();
  });

  it('should render empty state component in Spanish when there are no establishments', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const view = render(<EstablishmentListScreen />);

    expect(await view.findByText('Tu campo empieza acá')).toBeTruthy();
  });

  it('should render list of establishments displaying "Localidad, Provincia" and "ha"', async () => {
    const mockData = [
      { id: '1', name: 'La Margarita', locality: 'Pergamino', province: 'Buenos Aires', superficieHa: 1500 },
      { id: '2', name: 'Los Alamos', locality: 'Venado Tuerto', province: 'Santa Fe', superficieHa: 800 },
    ];
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const view = render(<EstablishmentListScreen />);

    expect(await view.findByText('Pergamino, Buenos Aires')).toBeTruthy();
    expect(await view.findByText('Venado Tuerto, Santa Fe')).toBeTruthy();
    expect(await view.findByText('1500 ha')).toBeTruthy();
    expect(await view.findByText('800 ha')).toBeTruthy();
  });

  it('should not attempt to read imageUrl from DTO mock (Prohibición de fotos de BD)', async () => {
    const rawData = {
      id: '3',
      name: 'El ombu',
      locality: 'Rojas',
      province: 'Buenos Aires',
      superficieHa: 100,
    };

    const proxyData = new Proxy(rawData, {
      get(target: any, prop: string) {
        if (prop === 'imageUrl') {
          throw new Error('Contract violation: Component attempted to read imageUrl from DTO');
        }
        return target[prop];
      },
    });

    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [proxyData] });

    const view = render(<EstablishmentListScreen />);

    expect(await view.findByText('El ombu')).toBeTruthy();
  });

  it('should use accessible roles for buttons and navigate correctly', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const view = render(<EstablishmentListScreen />);

    const buttons = await view.findAllByLabelText('Agregar establecimiento');
    fireEvent.press(buttons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('EstablishmentForm');
  });

  it('should navigate to Detail when pressing an establishment card using accessible button role', async () => {
    const mockData = [
      { id: '123', name: 'La Margarita', locality: 'Pergamino', province: 'Buenos Aires', superficieHa: 1500 },
    ];
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const view = render(<EstablishmentListScreen />);

    const itemBtn = await view.findByRole('button', { name: /la margarita/i });
    fireEvent.press(itemBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('EstablishmentDetail', { id: '123' });
    });
  });
});
