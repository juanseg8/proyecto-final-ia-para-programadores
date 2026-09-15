import React from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { EstablishmentDetailScreen } from '../src/screens/EstablishmentDetailScreen';
import { apiClient } from '../src/apiClient';
import { useRoute, useNavigation } from '@react-navigation/native';

// Mock react-navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: { id: 'est-123' },
  }),
}));

// Mock api client
jest.mock('../src/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('EstablishmentDetailScreen', () => {
  afterEach(() => {
    cleanup();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // Find the confirm button (usually the one with style 'destructive' or text 'Eliminar') and press it
      const confirmButton = buttons?.find(b => b.style === 'destructive' || b.text === 'Eliminar' || b.text === 'Sí');
      if (confirmButton && confirmButton.onPress) {
        confirmButton.onPress();
      }
    });
  });

  describe('Invariantes', () => {
    it('[INV-05] Debe respetar el ownership en GET y navegar hacia atrás en caso de 404', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce({ response: { status: 404 } });

      await render(<EstablishmentDetailScreen />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/establishments/est-123');
        expect(mockGoBack).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith(
          expect.anything(),
          expect.stringContaining('No tienes permiso')
        );
      });
    });

    it('[INV-05] Debe respetar el ownership en DELETE y cancelar la eliminación en caso de 404', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { id: 'est-123', name: 'La Margarita' }
      });
      (apiClient.delete as jest.Mock).mockRejectedValueOnce({ response: { status: 404 } });

      await render(<EstablishmentDetailScreen />);

      const deleteBtn = await screen.findByText('Eliminar');
      fireEvent.press(deleteBtn);

      await waitFor(() => {
        expect(apiClient.delete).toHaveBeenCalledWith('/establishments/est-123');
        // No debe haber navegado hacia atrás porque falló
        expect(mockGoBack).not.toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith(
          expect.anything(),
          expect.stringContaining('No tienes permiso')
        );
      });
    });
  });

  describe('Criterios de Aceptación (Fase RED)', () => {
    it('1. Renderizado: Carga los datos del establecimiento y los visualiza', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { id: 'est-123', name: 'La Margarita', province: 'Buenos Aires', superficieHa: 500 }
      });

      await render(<EstablishmentDetailScreen />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/establishments/est-123');
        expect(screen.getByText('La Margarita')).toBeTruthy();
        expect(screen.getByText('Buenos Aires')).toBeTruthy();
        expect(screen.getByText('500')).toBeTruthy();
      });
    });

    it('2. Navegación a edición: Existe un botón que rutea hacia formulario enviando el ID', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { id: 'est-123', name: 'La Margarita' }
      });

      await render(<EstablishmentDetailScreen />);

      const editBtn = await screen.findByText('Editar');
      fireEvent.press(editBtn);

      expect(mockNavigate).toHaveBeenCalledWith('EstablishmentForm', { id: 'est-123' });
    });

    it('3. Eliminación: Muestra warning, llama a apiClient.delete y navega a listado', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { id: 'est-123', name: 'La Margarita' }
      });
      (apiClient.delete as jest.Mock).mockResolvedValueOnce({ data: {} });

      await render(<EstablishmentDetailScreen />);

      const deleteBtn = await screen.findByText('Eliminar');
      fireEvent.press(deleteBtn);

      await waitFor(() => {
        expect(apiClient.delete).toHaveBeenCalledWith('/establishments/est-123');
        expect(mockGoBack).toHaveBeenCalled();
      });
    });
  });
});
