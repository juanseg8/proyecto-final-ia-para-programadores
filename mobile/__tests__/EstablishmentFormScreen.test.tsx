import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react-native';
import { EstablishmentFormScreen } from '../src/screens/EstablishmentFormScreen';
import { apiClient } from '../src/apiClient';
import { georefService } from '../src/services/georefService';

jest.mock('../src/components/MapLocationPicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View testID="map-location-picker" />
  };
});

var mockUseRoute = jest.fn();

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => mockUseRoute(),
}));

// Mock API client
jest.mock('../src/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
  },
}));

// Mock georefService
jest.mock('../src/services/georefService', () => ({
  georefService: {
    getProvinces: jest.fn(),
    getLocalities: jest.fn(),
  },
}));

describe('EstablishmentFormScreen (Fase RED)', () => {
  afterEach(async () => {
    cleanup();
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoute.mockReturnValue({ params: {} });
    
    (georefService.getProvinces as jest.Mock).mockResolvedValue([
      { id: '06', nombre: 'Buenos Aires' },
      { id: '14', nombre: 'Cordoba' }
    ]);
    (georefService.getLocalities as jest.Mock).mockImplementation((prov) => {
      if (prov === 'Buenos Aires') return Promise.resolve([{ id: '060001', nombre: 'Tandil' }]);
      if (prov === 'Cordoba') return Promise.resolve([{ id: '140001', nombre: 'Rio Cuarto' }]);
      return Promise.resolve([]);
    });
  });

  it('renders all basic inputs and strictly prohibits technical titles', async () => {
    await act(async () => {
      render(<EstablishmentFormScreen />);
    });
    
    // Prohibir títulos técnicos
    const stringifiedTree = JSON.stringify(screen.toJSON());
    expect(stringifiedTree).not.toMatch(/NewEstablishment/);
    expect(stringifiedTree).not.toMatch(/EditEstablishment/);
    
    // Exigir título amigable
    expect(screen.getByText(/Nuevo Establecimiento|Crear Establecimiento/i)).toBeTruthy();

    expect(screen.getByPlaceholderText(/nombre/i)).toBeTruthy();
  });

  it('enforces semantic reading of "Ubicación" section with map and GPS integrated', async () => {
    await act(async () => {
      render(<EstablishmentFormScreen />);
    });
    
    // Debe haber un texto de sección visible
    expect(screen.getByText('Ubicación')).toBeTruthy();
    
    // Presencia estructurada
    expect(screen.getByPlaceholderText('Seleccionar Provincia')).toBeTruthy();
    expect(screen.getByPlaceholderText('Seleccionar Localidad')).toBeTruthy();
    expect(screen.getByTestId('map-location-picker')).toBeTruthy();
    
    // Botón GPS
    expect(screen.getByRole('button', { name: /GPS/i })).toBeTruthy();
  });

  it('demands visual reference of "ha" or area unit for superficie', async () => {
    await act(async () => {
      render(<EstablishmentFormScreen />);
    });
    
    expect(screen.getByPlaceholderText(/superficie/i)).toBeTruthy();
    
    // Tiene que mostrar el sufijo "ha" visualmente, no solo un placeholder numérico.
    expect(screen.getByText(/\bha\b/i)).toBeTruthy();
  });

  it('submits form successfully, validando EXTREMA SEGURIDAD del Payload Canónico', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: { id: 1 } });
    await act(async () => {
      render(<EstablishmentFormScreen />);
    });
    
    await fireEvent.changeText(screen.getByPlaceholderText(/nombre/i), 'Estancia La Paz');
    await fireEvent.changeText(screen.getByPlaceholderText(/superficie/i), '500');
    
    fireEvent.press(screen.getByTestId('province-selector'));
    const provOption = await screen.findByText('Buenos Aires');
    await act(async () => {
      fireEvent.press(provOption.parent || provOption);
      await new Promise(r => setTimeout(r, 0));
    });

    await waitFor(() => {
      expect(screen.getByTestId('locality-selector').props.accessibilityState?.disabled).toBeFalsy();
    });

    fireEvent.press(screen.getByTestId('locality-selector'));
    const locOption = await screen.findByText('Tandil');
    await act(async () => {
      fireEvent.press(locOption.parent || locOption);
      await new Promise(r => setTimeout(r, 0));
    });
    
    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: /guardar/i }));
      await new Promise(r => setTimeout(r, 0));
    });
    
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });
    
    const submittedPayload = (apiClient.post as jest.Mock).mock.calls[0][1];
    
    expect(submittedPayload).not.toHaveProperty('userId');
    expect(submittedPayload).not.toHaveProperty('normalizedName');
    
    // EXTREMA SEGURIDAD: Tipo exacto 'number' para superficieHa
    expect(typeof submittedPayload.superficieHa).toBe('number');
    expect(submittedPayload.superficieHa).toBe(500);

    // Sin IDs ocultos en la geografía
    expect(submittedPayload.province).toBe('Buenos Aires');
    expect(submittedPayload.locality).toBe('Tandil');
    expect(submittedPayload).not.toHaveProperty('provinceId');
    expect(submittedPayload).not.toHaveProperty('localityId');
    const stringifiedPayload = JSON.stringify(submittedPayload);
    expect(stringifiedPayload).not.toMatch(/"06"/);
    expect(stringifiedPayload).not.toMatch(/"060001"/);
  });

  it('handles 409 Conflict perfectly', async () => {
    (apiClient.post as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 409,
        data: { message: 'El nombre ya existe' }
      }
    });

    await act(async () => {
      render(<EstablishmentFormScreen />);
    });
    
    await act(async () => {
      await fireEvent.changeText(screen.getByPlaceholderText(/nombre/i), 'Estancia Duplicada');
      fireEvent.press(screen.getByRole('button', { name: /guardar/i }));
      await new Promise(r => setTimeout(r, 0));
    });
    
    expect(await screen.findByText(/El nombre ya existe/i)).toBeTruthy();
  });

  it('handles 400 Bad Request properly', async () => {
    (apiClient.post as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message: 'Error de validación genérico' }
      }
    });

    await act(async () => {
      render(<EstablishmentFormScreen />);
    });
    
    await act(async () => {
      await fireEvent.changeText(screen.getByPlaceholderText(/nombre/i), 'A');
      fireEvent.press(screen.getByRole('button', { name: /guardar/i }));
      await new Promise(r => setTimeout(r, 0));
    });
    
    expect(await screen.findByText(/Error de validación genérico/i)).toBeTruthy();
  });

  it('loads existing establishment data on edit mode and uses superficieHa', async () => {
    mockUseRoute.mockReturnValue({ params: { id: 'est-edit-1' } });

    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: {
        id: 'est-edit-1',
        name: 'Estancia Vieja',
        province: 'Cordoba',
        locality: 'Rio Cuarto',
        superficieHa: 1200
      }
    });

    await act(async () => {
      render(<EstablishmentFormScreen />);
    });
    
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/establishments/est-edit-1');
    });

    expect(await screen.findByDisplayValue('Estancia Vieja')).toBeTruthy();
    expect(await screen.findByDisplayValue('Cordoba')).toBeTruthy();
    expect(await screen.findByDisplayValue('Rio Cuarto')).toBeTruthy();
    expect(await screen.findByDisplayValue('1200')).toBeTruthy();
  });
});
