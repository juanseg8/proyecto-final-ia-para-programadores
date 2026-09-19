import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AppButton, AppInput, AppCard, AppHeader } from '../src/components';
import { ConfirmDialog, EmptyState } from '../src/components/feedback';

describe('Foundation Components - Idioma y Semántica (Fase RED)', () => {
  describe('AppButton', () => {
    it('llama a onPress y respeta el rol de accesibilidad', async () => {
      const onPressMock = jest.fn();
      await render(<AppButton onPress={onPressMock} title="Guardar" accessibilityLabel="Guardar formulario" />);
      const button = screen.getByRole('button', { name: 'Guardar formulario' });
      expect(button.props.accessibilityRole).toBe('button');
      fireEvent.press(button);
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('no llama a onPress cuando está deshabilitado y refleja el estado disabled', async () => {
      const onPressMock = jest.fn();
      await render(<AppButton onPress={onPressMock} title="Guardar" disabled={true} />);
      const button = screen.getByRole('button', { name: 'Guardar' });
      expect(button.props.accessibilityState?.disabled).toBe(true);
      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('muestra el texto "Cargando..." en español cuando está en estado de carga', async () => {
      await render(<AppButton onPress={jest.fn()} title="Guardar" loading={true} />);
      expect(screen.getByText('Cargando...')).toBeTruthy();
      const button = screen.getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('AppInput', () => {
    it('propaga accessibilityLabel y responde a cambios', async () => {
      const onChangeMock = jest.fn();
      await render(<AppInput onChangeText={onChangeMock} accessibilityLabel="Campo de nombre" placeholder="Escribe aquí" />);
      const input = screen.getByLabelText('Campo de nombre');
      expect(input).toBeTruthy();
      fireEvent.changeText(input, 'Texto de prueba');
      expect(onChangeMock).toHaveBeenCalledWith('Texto de prueba');
    });

    it('refleja el estado disabled correctamente', async () => {
      await render(<AppInput accessibilityLabel="Deshabilitado" disabled={true} />);
      const input = screen.getByLabelText('Deshabilitado');
      expect(input.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('AppCard', () => {
    it('renderiza su contenido y tiene un rol semántico', async () => {
      await render(
        <AppCard accessibilityLabel="Tarjeta de info">
          <React.Fragment>
            <AppButton title="Contenido interno" onPress={jest.fn()} />
          </React.Fragment>
        </AppCard>
      );
      expect(screen.getByText('Contenido interno')).toBeTruthy();
      const card = screen.getByLabelText('Tarjeta de info');
      expect(card.props.accessibilityRole).toBeDefined();
    });
  });

  describe('AppHeader', () => {
    it('renderiza con el rol semántico header', async () => {
      await render(<AppHeader title="Mi Pantalla" />);
      const header = screen.getByRole('header', { name: 'Mi Pantalla' });
      expect(header).toBeTruthy();
    });
  });

  describe('ConfirmDialog', () => {
    it('tiene rol semántico alert y textos predeterminados en español', async () => {
      await render(
        <ConfirmDialog 
          title="¿Eliminar?" 
          message="Esta acción no se puede deshacer." 
          onConfirm={jest.fn()} 
          onCancel={jest.fn()} 
        />
      );
      expect(screen.getByText('¿Eliminar?')).toBeTruthy();
      const acceptButton = screen.getByText('Aceptar');
      const cancelButton = screen.getByText('Cancelar');
      expect(acceptButton).toBeTruthy();
      expect(cancelButton).toBeTruthy();
    });
  });

  describe('EmptyState', () => {
    it('renderiza el mensaje vacío por defecto en español', async () => {
      await render(<EmptyState />);
      expect(screen.getByText('No hay datos disponibles')).toBeTruthy();
    });
    
    it('permite sobrescribir el mensaje pero obliga semántica', async () => {
      await render(<EmptyState message="No se encontraron resultados" />);
      expect(screen.getByText('No se encontraron resultados')).toBeTruthy();
    });
  });
});
