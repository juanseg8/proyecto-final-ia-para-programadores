import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../theme/theme';

interface FormFieldProps extends ViewProps {
  label: string;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, children, style, ...props }) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[16],
  },
  label: {
    color: theme.colors.textPrimary,
    ...theme.typography.label,
    marginBottom: theme.spacing[8],
  },
  error: {
    color: theme.colors.error,
    ...theme.typography.caption,
    marginTop: theme.spacing[4],
  },
});
