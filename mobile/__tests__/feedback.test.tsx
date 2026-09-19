import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react-native';
import { EmptyState, LoadingState, ErrorState, FeedbackToast, ConfirmDialog } from '../src/components/feedback';

describe('Feedback and State Components', () => {
  describe('EmptyState', () => {
    it('renders title and message correctly', async () => {
      await render(<EmptyState title="No hay datos" message="Intenta más tarde" />);
      expect(screen.getByText('No hay datos')).toBeTruthy();
      expect(screen.getByText('Intenta más tarde')).toBeTruthy();
    });
  });

  describe('LoadingState', () => {
    it('renders loading indicator with accessibility role', async () => {
      await render(<LoadingState message="Cargando..." />);
      expect(screen.getByText('Cargando...')).toBeTruthy();
      expect(screen.getByRole('progressbar')).toBeTruthy();
    });
  });

  describe('ErrorState', () => {
    it('renders error message and retry button', async () => {
      const mockRetry = jest.fn();
      await render(<ErrorState title="Error" message="Algo salió mal" onRetry={mockRetry} />);
      
      expect(screen.getByText('Error')).toBeTruthy();
      expect(screen.getByText('Algo salió mal')).toBeTruthy();
      
      const retryButton = screen.getByRole('button', { name: /reintentar/i });
      fireEvent.press(retryButton);
      expect(mockRetry).toHaveBeenCalled();
    });
  });

  describe('FeedbackToast', () => {
    it('renders message based on state prop', async () => {
      await render(<FeedbackToast message="Operación exitosa" type="success" />);
      expect(screen.getByText('Operación exitosa')).toBeTruthy();
    });
  });

  describe('ConfirmDialog', () => {
    it('handles destructive confirmation and closing', async () => {
      const mockConfirm = jest.fn();
      const mockCancel = jest.fn();

      await render(
        <ConfirmDialog 
          title="Eliminar elemento" 
          message="¿Estás seguro?" 
          onConfirm={mockConfirm} 
          onCancel={mockCancel} 
          isDestructive={true} 
        />
      );
      
      expect(screen.getByText('Eliminar elemento')).toBeTruthy();
      expect(screen.getByText('¿Estás seguro?')).toBeTruthy();
      
      // Cancel
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      fireEvent.press(cancelButton);
      expect(mockCancel).toHaveBeenCalled();
      
      // Confirm
      const confirmButton = screen.getByRole('button', { name: /confirmar|eliminar/i });
      fireEvent.press(confirmButton);
      expect(mockConfirm).toHaveBeenCalled();
    });
  });
});
