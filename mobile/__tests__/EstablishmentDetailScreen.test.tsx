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
  useFocusEffect: jest.fn((cb) => { require('react').useEffect(cb, []); }),
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
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  describe('Invariantes', () => {
    it('[INV-05] Debe respetar el ownership en GET y navegar hacia atrás en caso de 404', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce({ response: { status: 404 } });

      await render(<EstablishmentDetailScreen />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/establishments/est-123');
        expect(mockGoBack).toHaveBeenCalled();
        
        // Exige limpieza total de tecnicismos
        const alertCalls = (Alert.alert as jest.Mock).mock.calls;
        expect(alertCalls.length).toBeGreaterThan(0);
        const [title, message] = alertCalls[0];
        expect(title).not.toMatch(/404|status|id|error/i);
        expect(message).not.toMatch(/404|status|id/i);
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

      const cancelBtn = await screen.findByText('Cancelar');
      expect(cancelBtn).toBeTruthy();

      const allDeleteBtns = screen.getAllByText('Eliminar');
      fireEvent.press(allDeleteBtns[allDeleteBtns.length - 1]);

      await waitFor(() => {
        expect(apiClient.delete).toHaveBeenCalledWith('/establishments/est-123');
        expect(mockGoBack).not.toHaveBeenCalled();
        
        // Exige limpieza total de tecnicismos
        const alertCalls = (Alert.alert as jest.Mock).mock.calls;
        const [, message] = alertCalls[alertCalls.length - 1];
        expect(message).not.toMatch(/404|status|id/i);
      });
    });
  });

  describe('Criterios de Aceptación (Fase RED)', () => {
    it('1. Renderizado: Exige lectura jerárquica de la entidad (Localidad, Provincia) y XX ha', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { id: 'est-123', name: 'La Margarita', locality: 'Tandil', province: 'Buenos Aires', superficieHa: 500 }
      });

      await render(<EstablishmentDetailScreen />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/establishments/est-123');
        expect(screen.getByText('La Margarita')).toBeTruthy();
        
        // Lectura jerárquica
        expect(screen.getByText('Tandil, Buenos Aires')).toBeTruthy();
        expect(screen.getByText('500 ha')).toBeTruthy();
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

    it('3. Eliminación: Muestra warning, exige botones Eliminar y Cancelar, llama a apiClient y navega', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { id: 'est-123', name: 'La Margarita' }
      });
      (apiClient.delete as jest.Mock).mockResolvedValueOnce({ data: {} });

      await render(<EstablishmentDetailScreen />);

      const deleteBtn = await screen.findByText('Eliminar');
      fireEvent.press(deleteBtn);

      // Exigir textos del diálogo exactos
      expect(await screen.findByText('Cancelar')).toBeTruthy();
      
      const allDeleteBtns = screen.getAllByText('Eliminar');
      expect(allDeleteBtns.length).toBeGreaterThanOrEqual(2);
      
      // Confirmamos eliminación
      fireEvent.press(allDeleteBtns[allDeleteBtns.length - 1]);

      await waitFor(() => {
        expect(apiClient.delete).toHaveBeenCalledWith('/establishments/est-123');
        expect(mockGoBack).toHaveBeenCalled();
      });
    });
  });
});
