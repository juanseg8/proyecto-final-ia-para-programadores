import React, { ReactNode } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface AppInputProps extends TextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  label?: string;
  style?: any;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIcon?: ReactNode;
}

export const AppInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  label,
  style,
  leftIcon,
  rightIcon,
  ...props
}: AppInputProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.inputContainer,
        { borderColor: error ? theme.colors.semantic.error : theme.colors.neutral[200] },
        props.multiline && { height: 'auto', minHeight: 100, alignItems: 'flex-start', paddingVertical: 12 }
      ]}>
        {leftIcon && (
          <View style={[styles.leftIconContainer, props.multiline && { marginTop: label ? 20 : 0 }]}>
            <MaterialCommunityIcons name={leftIcon} size={24} color={theme.colors.neutral[500]} />
          </View>
        )}
        <View style={styles.textContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          <TextInput
            style={[styles.input, !label && { height: '100%' }, props.multiline && { minHeight: 60, textAlignVertical: 'top', paddingTop: 8 }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.neutral[400]}
            secureTextEntry={secureTextEntry}
            {...props}
          />
        </View>
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    height: 64,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: theme.colors.neutral[0],
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  leftIconContainer: {
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.neutral[500],
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.neutral[900],
    paddingTop: 0,
    paddingBottom: 4,
  },
  rightIconContainer: {
    marginLeft: theme.spacing.md,
  },
  error: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.xs,
  },
});
