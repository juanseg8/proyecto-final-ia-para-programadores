import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = (props: any) => <View {...props}>{props.children}</View>;
  const MockMarker = (props: any) => <View {...props}>{props.children}</View>;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: 0, longitude: 0 } })
}));

import { HomeScreen } from '../src/screens/HomeScreen';
import { EstablishmentListScreen } from '../src/screens/EstablishmentListScreen';
import { EstablishmentFormScreen } from '../src/screens/EstablishmentFormScreen';
import { EstablishmentDetailScreen } from '../src/screens/EstablishmentDetailScreen';
import { AuthContext } from '../src/AuthContext';
import { apiClient } from '../src/apiClient';

jest.mock('../src/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  setOnLogoutCallback: jest.fn(),
  clearStorage: jest.fn(),
}));

import App from '../App';

const Stack = createNativeStackNavigator();

const AppMock = () => {
  return (
    <AuthContext.Provider value={{ user: { email: 'test@test.com' }, isLoading: false, login: jest.fn(), register: jest.fn(), logout: jest.fn() } as any}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ animation: 'none' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EstablishmentList" component={EstablishmentListScreen} />
        <Stack.Screen name="EstablishmentForm" component={EstablishmentFormScreen} />
        <Stack.Screen name="EstablishmentDetail" component={EstablishmentDetailScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

describe('UX01-FIX01 - Navigation and Auto Refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('RED: Navigation and Auto Refresh Integration (CREATE, UPDATE, DELETE)', async () => {
    // -----------------------------------------------------
    // CREATE FLOW
    // -----------------------------------------------------
    (apiClient.get as jest.Mock).mockImplementation((url) => {
        if (url === '/establishments') {
            return Promise.resolve({ data: [{ id: '1', name: 'Establecimiento A', province: 'Buenos Aires', locality: 'Pergamino' }] });
        }
        if (url === '/establishments/1') {
            return Promise.resolve({ data: { id: '1', name: 'Establecimiento A', province: 'Buenos Aires', locality: 'Pergamino' } });
        }
        return Promise.resolve({ data: [] });
    });

    render(<AppMock />);

    // Go to list — el HomeScreen ahora usa accessibilityLabel "Ver establecimientos"
    await waitFor(() => expect(screen.getAllByLabelText('Ver establecimientos').length).toBeGreaterThan(0));
    await act(async () => {
        fireEvent.press(screen.getAllByLabelText('Ver establecimientos')[0]);
    });

    await waitFor(() => expect(screen.getByText('Establecimiento A')).toBeTruthy());

    // Go to create — el header "+" tiene accessibilityLabel "Agregar establecimiento"
    await waitFor(() => expect(screen.getByLabelText('Agregar establecimiento')).toBeTruthy());
    await act(async () => {
        fireEvent.press(screen.getByLabelText('Agregar establecimiento'));
    });

    // Fill form
    await waitFor(() => expect(screen.getByPlaceholderText('Nombre')).toBeTruthy());
    await act(async () => {
        fireEvent.changeText(screen.getByPlaceholderText('Nombre'), 'Establecimiento B');
    });
    
    // Simulate successful create
    (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: { id: '2' } });
    
    // Prepare next fetch for the list
    (apiClient.get as jest.Mock).mockImplementation((url) => {
        if (url === '/establishments') {
            return Promise.resolve({
              data: [
                { id: '1', name: 'Establecimiento A', province: 'Buenos Aires', locality: 'Pergamino' },
                { id: '2', name: 'Establecimiento B', province: 'Buenos Aires', locality: 'Pergamino' }
              ]
            });
        }
        if (url === '/establishments/1') {
            return Promise.resolve({ data: { id: '1', name: 'Establecimiento A', province: 'Buenos Aires', locality: 'Pergamino' } });
        }
        return Promise.resolve({ data: [] });
    });

    await act(async () => {
        fireEvent.press(screen.getByText('Guardar'));
    });

    await new Promise(r => setTimeout(r, 500));

    // Check if the list auto-refreshed
    await waitFor(() => expect(screen.getByText('Establecimiento B')).toBeTruthy());

    // -----------------------------------------------------
    // UPDATE FLOW
    // -----------------------------------------------------
    // Click item to go to detail
    await waitFor(() => expect(screen.getByText('Establecimiento A')).toBeTruthy());
    await act(async () => {
        fireEvent.press(screen.getByText('Establecimiento A'));
    });

    // Sleep to let navigation and state flush
    await new Promise(r => setTimeout(r, 500));

    // Now in detail view
    await waitFor(() => expect(screen.getByText('Editar')).toBeTruthy());
    await act(async () => {
        fireEvent.press(screen.getByText('Editar'));
    });

    // Wait for form to appear
    await waitFor(() => expect(screen.getByPlaceholderText('Nombre')).toBeTruthy());
    await act(async () => {
        fireEvent.changeText(screen.getByPlaceholderText('Nombre'), 'Establecimiento Modificado');
    });

    (apiClient.put as jest.Mock).mockResolvedValueOnce({ data: { id: '1' } });

    // Mock new data for detail
    (apiClient.get as jest.Mock).mockImplementation((url) => {
        if (url === '/establishments/1') {
            return Promise.resolve({ data: { id: '1', name: 'Establecimiento Modificado', province: 'Buenos Aires', locality: 'Pergamino' } });
        }
        if (url === '/establishments') {
            return Promise.resolve({
              data: [
                { id: '1', name: 'Establecimiento Modificado', province: 'Buenos Aires', locality: 'Pergamino' },
                { id: '2', name: 'Establecimiento B', province: 'Buenos Aires', locality: 'Pergamino' }
              ]
            });
        }
        return Promise.resolve({ data: [] });
    });

    await act(async () => {
        fireEvent.press(screen.getByText('Guardar'));
    });

    // Check if the detail updated
    await waitFor(() => expect(screen.getByText('Establecimiento Modificado')).toBeTruthy());

    // -----------------------------------------------------
    // DELETE FLOW
    // -----------------------------------------------------
    await waitFor(() => expect(screen.getByText('Eliminar')).toBeTruthy());
    await act(async () => {
        fireEvent.press(screen.getByText('Eliminar'));
    });

    await waitFor(() => expect(screen.getAllByText('Eliminar')[1]).toBeTruthy());
    
    (apiClient.delete as jest.Mock).mockResolvedValueOnce({});
    
    // Check that we're still on the detail screen before confirming
    expect(screen.getByText('Establecimiento Modificado')).toBeTruthy();

    // Once deleted, navigating back should refresh the list
    (apiClient.get as jest.Mock).mockImplementation((url) => {
        if (url === '/establishments') {
            return Promise.resolve({ data: [{ id: '2', name: 'Establecimiento B', province: 'Buenos Aires', locality: 'Pergamino' }] });
        }
        return Promise.resolve({ data: [] });
    });

    // Confirm deletion
    await act(async () => {
        const deleteBtns = screen.getAllByText('Eliminar');
        fireEvent.press(deleteBtns[deleteBtns.length - 1]);
    });

    await new Promise(r => setTimeout(r, 500));

    // The list should show only Establishment B, A is gone
    await waitFor(() => expect(screen.getByText('Establecimiento B')).toBeTruthy());
    await waitFor(() => expect(screen.queryByText('Establecimiento Modificado')).toBeNull());
  });
});
