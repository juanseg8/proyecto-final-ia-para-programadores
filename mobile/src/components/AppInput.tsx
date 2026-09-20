// entire file content ...
import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../theme/theme';

export const AppInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  label,
  ...props
}: TextInputProps & {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  label?: string;
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{label}</Text>}
      <TextInput
        style={[styles.input, { borderColor: error ? theme.colors.error : theme.colors.border }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        secureTextEntry={secureTextEntry}
        {...props}
      />
      {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[16],
  },
  label: {
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    marginBottom: theme.spacing[8],
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: theme.radius.input,
    padding: theme.spacing[12],
    fontSize: theme.typography.body.fontSize,
    backgroundColor: theme.colors.surface,
  },
  error: {
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing[8],
  },
});
