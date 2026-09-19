import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react-native';
import { BottomNav } from '../src/components/BottomNav';
import { AppHeader } from '../src/components/AppHeader';

describe('Navigation Components', () => {
  afterEach(cleanup);
  describe('AppHeader', () => {
    it('should render title and back button', async () => {
      const mockGoBack = jest.fn();
      await render(
        <AppHeader title="Mi Pantalla" onBack={mockGoBack} showBack={true} />
      );

      expect(screen.getByText('Mi Pantalla')).toBeTruthy();
      const backButton = screen.getByTestId('back-button');
      expect(backButton).toBeTruthy();

      fireEvent.press(backButton);
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('BottomNav', () => {
    it('should render allowed tabs (Inicio, Establecimientos)', async () => {
      const mockNavigate = jest.fn();
      await render(<BottomNav navigate={mockNavigate} />);
      
      expect(screen.getByText('Inicio')).toBeTruthy();
      expect(screen.getByText('Establecimientos')).toBeTruthy();
    });

    it('should NOT render prohibited future features like Indicadores', async () => {
      const mockNavigate = jest.fn();
      await render(<BottomNav navigate={mockNavigate} />);
      
      expect(screen.queryByText('Indicadores')).toBeNull();
    });

    it('should navigate to allowed routes when clicked', async () => {
      const mockNavigate = jest.fn();
      await render(<BottomNav navigate={mockNavigate} />);
      
      fireEvent.press(screen.getByText('Inicio'));
      expect(mockNavigate).toHaveBeenCalledWith('Home');

      fireEvent.press(screen.getByText('Establecimientos'));
      expect(mockNavigate).toHaveBeenCalledWith('Establishments');
    });
  });
});
