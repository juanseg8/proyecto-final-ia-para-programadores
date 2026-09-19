import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

interface AppInputProps extends TextInputProps {
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const AppInput: React.FC<AppInputProps> = ({
  style,
  disabled,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}) => {
  if (!leftIcon && !rightIcon) {
    return (
      <TextInput
        style={[styles.input, disabled && styles.disabledInput, style]}
        placeholderTextColor={theme.colors.textSecondary}
        editable={!disabled}
        accessibilityState={{ disabled: !!disabled }}
        {...props}
      />
    );
  }

  return (
    <View style={[styles.inputWrapper, disabled && styles.disabledWrapper]}>
      {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
      <TextInput
        style={[styles.inputInner, disabled && styles.disabledInner, style]}
        placeholderTextColor={theme.colors.textSecondary}
        editable={!disabled}
        accessibilityState={{ disabled: !!disabled }}
        {...props}
      />
      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.rightIconContainer}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    paddingHorizontal: theme.spacing[16],
    paddingVertical: theme.spacing[12],
    color: theme.colors.textPrimary,
    ...theme.typography.body,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    paddingHorizontal: theme.spacing[12],
  },
  disabledWrapper: {
    backgroundColor: theme.colors.background,
  },
  leftIconContainer: {
    marginRight: theme.spacing[8],
  },
  rightIconContainer: {
    marginLeft: theme.spacing[8],
    padding: 4,
  },
  inputInner: {
    flex: 1,
    paddingVertical: theme.spacing[12],
    color: theme.colors.textPrimary,
    ...theme.typography.body,
  },
  disabledInner: {
    color: theme.colors.textSecondary,
  },
  disabledInput: {
    backgroundColor: theme.colors.background,
    color: theme.colors.textSecondary,
  },
});

