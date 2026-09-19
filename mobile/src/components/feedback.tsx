import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message = 'No hay datos disponibles' }) => (
  <View style={styles.container} accessibilityRole="summary">
    {title && <Text style={styles.title}>{title}</Text>}
    <Text style={styles.message}>{message}</Text>
  </View>
);

interface LoadingStateProps {
  message: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => (
  <View style={styles.container}>
    <View accessible={true} accessibilityRole="progressbar" role="progressbar">
      <ActivityIndicator size="large" color={theme.colors.primaryLight} />
    </View>
    <Text style={styles.message}>{message}</Text>
  </View>
);

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry }) => (
  <View style={styles.container}>
    <Text style={[styles.title, { color: theme.colors.error }]}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    <AppButton title="Reintentar" onPress={onRetry} style={styles.button} />
  </View>
);

interface FeedbackToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({ message, type }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.textPrimary;
    }
  };

  return (
    <View style={[styles.toastContainer, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  visible?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, message, onConfirm, onCancel, isDestructive, visible = true }) => {
  if (!visible) return null;
  return (
    <View style={styles.dialogContainer} accessibilityRole="alert">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    <View style={styles.dialogActions}>
      <AppButton title="Cancelar" onPress={onCancel} style={[styles.dialogButton, styles.cancelButton]} />
      <AppButton 
        title={isDestructive ? 'Eliminar' : 'Aceptar'} 
        onPress={onConfirm} 
        style={[styles.dialogButton, isDestructive && styles.destructiveButton]} 
      />
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[24],
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[8],
    textAlign: 'center',
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing[16],
  },
  button: {
    marginTop: theme.spacing[16],
  },
  toastContainer: {
    padding: theme.spacing[16],
    borderRadius: theme.radius.card,
    margin: theme.spacing[16],
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastText: {
    ...theme.typography.body,
    color: theme.colors.surface,
    flex: 1,
  },
  dialogContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.modal,
    padding: theme.spacing[24],
    margin: theme.spacing[24],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing[24],
    gap: theme.spacing[12],
  },
  dialogButton: {
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  destructiveButton: {
    backgroundColor: theme.colors.error,
  }
});
