import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import MapLocationPicker from '../src/components/MapLocationPicker';

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = (props: any) => <View testID="map-view" {...props}>{props.children}</View>;
  const MockMarker = (props: any) => <View testID="map-marker" {...props}>{props.children}</View>;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    PROVIDER_GOOGLE: 'google',
  };
});

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}), { virtual: true });

import * as Location from 'expo-location';

describe('MapLocationPicker (F02 Tarea 9 y 10 - Fase RED)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar el botón "Abrir Mapa" en el renderizado inicial', async () => {
    const mockOnLocationSelected = jest.fn();
    await render(<MapLocationPicker onLocationSelected={mockOnLocationSelected} />);

    expect(screen.getByRole('button', { name: /Abrir Mapa/i })).toBeTruthy();
  });

  it('debe propagar las coordenadas al confirmar la ubicación manualmente', async () => {
    const mockOnLocationSelected = jest.fn();
    await render(<MapLocationPicker onLocationSelected={mockOnLocationSelected} />);

    fireEvent.press(screen.getByRole('button', { name: /Abrir Mapa/i }));

    const confirmButton = await screen.findByRole('button', { name: /Confirmar ubicación/i });
    fireEvent.press(confirmButton);

    expect(mockOnLocationSelected).toHaveBeenCalledTimes(1);
    expect(mockOnLocationSelected).toHaveBeenCalledWith(
      expect.objectContaining({
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      })
    );
  });

  // NUEVOS TESTS - TAREA 10 (GPS Y PERMISOS)
  it('GPS Permiso concedido: Obtiene ubicación actual y la muestra', async () => {
    const mockOnLocationSelected = jest.fn();
    
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: -34.6037, longitude: -58.3816 }
    });

    await render(<MapLocationPicker onLocationSelected={mockOnLocationSelected} />);
    fireEvent.press(screen.getByRole('button', { name: /Abrir Mapa/i }));

    const gpsButton = await screen.findByRole('button', { name: /Usar mi ubicación actual/i });
    fireEvent.press(gpsButton);

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
      expect(Location.getCurrentPositionAsync).toHaveBeenCalledTimes(1);
    });

    const confirmButton = await screen.findByRole('button', { name: /Confirmar ubicación/i });
    fireEvent.press(confirmButton);

    expect(mockOnLocationSelected).toHaveBeenCalledWith(
      expect.objectContaining({
        latitude: -34.6037,
        longitude: -58.3816,
      })
    );
  });

  it('GPS Permiso rechazado: No bloquea la app y permite selección manual', async () => {
    const mockOnLocationSelected = jest.fn();
    
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
    
    await render(<MapLocationPicker onLocationSelected={mockOnLocationSelected} />);
    fireEvent.press(screen.getByRole('button', { name: /Abrir Mapa/i }));

    const gpsButton = await screen.findByRole('button', { name: /Usar mi ubicación actual/i });
    fireEvent.press(gpsButton);

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
      expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
    });

    // Validar fallback manual: la app no crashea, y permite confirmar
    const confirmButton = await screen.findByRole('button', { name: /Confirmar ubicación/i });
    fireEvent.press(confirmButton);

    expect(mockOnLocationSelected).toHaveBeenCalledTimes(1);
  });

  it('GPS Fallo genérico: Si el OS falla al obtener la ubicación, tampoco debe romper el flujo', async () => {
    const mockOnLocationSelected = jest.fn();
    
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(new Error('Location unavailable'));

    await render(<MapLocationPicker onLocationSelected={mockOnLocationSelected} />);
    fireEvent.press(screen.getByRole('button', { name: /Abrir Mapa/i }));

    const gpsButton = await screen.findByRole('button', { name: /Usar mi ubicación actual/i });
    fireEvent.press(gpsButton);

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
      expect(Location.getCurrentPositionAsync).toHaveBeenCalledTimes(1);
    });

    // Validar fallback manual: la app no crashea, y permite confirmar (con coords previas o default)
    const confirmButton = await screen.findByRole('button', { name: /Confirmar ubicación/i });
    fireEvent.press(confirmButton);

    expect(mockOnLocationSelected).toHaveBeenCalledTimes(1);
  });

  // NUEVOS TESTS - TAREA 3 (GOOGLE MAPS)
  it('debe configurar explícitamente Google Maps como proveedor', async () => {
    await render(<MapLocationPicker onLocationSelected={jest.fn()} />);
    fireEvent.press(screen.getByRole('button', { name: /Abrir Mapa/i }));

    const mapView = await screen.findByTestId('map-view');
    // El mapa debe forzar el provider a "google" (PROVIDER_GOOGLE) para no caer en Apple Maps por defecto en iOS
    expect(mapView.props.provider).toBe('google');
  });
});

