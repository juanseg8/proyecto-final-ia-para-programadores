import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import { EstablishmentFormScreen } from '../src/screens/EstablishmentFormScreen';
import { apiClient } from '../src/apiClient';

jest.mock('../src/components/MapLocationPicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View testID="map-location-picker" />
  };
});

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: jest.fn().mockReturnValue({
    params: {},
  }),
}));

// Mock API client
jest.mock('../src/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
  },
}));

describe('EstablishmentFormScreen', () => {
  afterEach(() => {
    cleanup();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all basic inputs (nombre, provincia, localidad, superficie)', async () => {
    await render(<EstablishmentFormScreen />);
    
    expect(screen.getByPlaceholderText(/nombre/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/provincia/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/localidad/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/superficie/i)).toBeTruthy();
    expect(screen.getByText(/guardar/i)).toBeTruthy();
  });

  it('prevents submission of dirty payload fields (userId, normalizedName, createdAt, updatedAt)', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: { id: 1 } });
    await render(<EstablishmentFormScreen />);
    
    await fireEvent.changeText(screen.getByPlaceholderText(/nombre/i), 'Estancia La Paz');
    await fireEvent.changeText(screen.getByPlaceholderText(/provincia/i), 'Buenos Aires');
    await fireEvent.changeText(screen.getByPlaceholderText(/localidad/i), 'Tandil');
    await fireEvent.changeText(screen.getByPlaceholderText(/superficie/i), '500');
    
    await fireEvent.press(screen.getByText(/guardar/i));
    
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });
    
    const submittedPayload = (apiClient.post as jest.Mock).mock.calls[0][1];
    
    // Invariant: no dirty payload
    expect(submittedPayload).not.toHaveProperty('userId');
    expect(submittedPayload).not.toHaveProperty('normalizedName');
    expect(submittedPayload).not.toHaveProperty('createdAt');
    expect(submittedPayload).not.toHaveProperty('updatedAt');
    
    // Ensure actual fields were passed
    expect(submittedPayload).toEqual(
      expect.objectContaining({
        name: 'Estancia La Paz',
        province: 'Buenos Aires',
        locality: 'Tandil',
        superficieHa: 500,
      })
    );
    await new Promise(r => setTimeout(r, 10)); // let handleSave finish
  });

  it('displays error message on 409 Conflict (e.g. name already exists)', async () => {
    (apiClient.post as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 409,
        data: { message: 'El nombre ya existe' }
      }
    });

    await render(<EstablishmentFormScreen />);
    
    const nombreInput = await screen.findByPlaceholderText(/nombre/i);
    await fireEvent.changeText(nombreInput, 'Estancia Duplicada');
    await fireEvent.changeText(await screen.findByPlaceholderText(/provincia/i), 'Buenos Aires');
    await fireEvent.changeText(await screen.findByPlaceholderText(/localidad/i), 'Tandil');
    await fireEvent.changeText(await screen.findByPlaceholderText(/superficie/i), '500');
    await fireEvent.press(screen.getByText(/guardar/i));

    // Verify UI shows the specific error message
    expect(await screen.findByText(/El nombre ya existe/i)).toBeTruthy();
    await new Promise(r => setTimeout(r, 10)); // let handleSave finish
  });

  it('displays generic error on 400 Bad Request', async () => {
    (apiClient.post as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message: 'Error de validaciA3n genAcrico' }
      }
    });

    await render(<EstablishmentFormScreen />);
    
    const nombreInput = await screen.findByPlaceholderText(/nombre/i);
    await fireEvent.changeText(nombreInput, 'A');
    await fireEvent.press(await screen.findByText(/guardar/i));

    // Wait for validation error to appear
    expect(await screen.findByText(/Error de validaciA3n genAcrico/i)).toBeTruthy();
    await new Promise(r => setTimeout(r, 10)); // let handleSave finish
  });

  it('loads existing establishment data on edit mode and uses superficieHa (Fase RED)', async () => {
    // Setup route params to simulate Edit mode
    const { useRoute } = require('@react-navigation/native');
    useRoute.mockReturnValueOnce({ params: { id: 'est-edit-1' } });

    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: {
        id: 'est-edit-1',
        name: 'Estancia Vieja',
        province: 'Cordoba',
        locality: 'Rio Cuarto',
        superficieHa: 1200
      }
    });

    await render(<EstablishmentFormScreen />);
    
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/establishments/est-edit-1');
    });

    // Check that it populates the form (it will fail because implementation uses surface)
    expect(await screen.findByDisplayValue('Estancia Vieja')).toBeTruthy();
    expect(await screen.findByDisplayValue('Cordoba')).toBeTruthy();
    expect(await screen.findByDisplayValue('Rio Cuarto')).toBeTruthy();
    expect(await screen.findByDisplayValue('1200')).toBeTruthy();
  });
});
