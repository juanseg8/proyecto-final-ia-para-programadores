import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { theme } from '../theme/theme';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({ 
  title, 
  onPress, 
  disabled, 
  loading,
  accessibilityLabel,
  style,
  ...props 
}) => {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: !!isDisabled }}
      style={[styles.button, isDisabled && styles.disabled, style]}
      {...props}
    >
      <Text style={[styles.text, isDisabled && styles.textDisabled]}>
        {loading ? 'Cargando...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.forest,
    paddingVertical: theme.spacing[16],
    paddingHorizontal: theme.spacing[24],
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: theme.colors.border,
  },
  text: {
    color: theme.colors.surface,
    ...theme.typography.body,
    fontWeight: '600',
  },
  textDisabled: {
    color: theme.colors.textSecondary,
  },
});
