// entire file content ...
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { theme } from '../theme/theme';

export const AppButton = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  destructive = false,
  ...props
}: TouchableOpacityProps & {
  title: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  destructive?: boolean;
}) => {
  const getBackgroundColor = () => {
    if (destructive) return theme.colors.error;
    if (disabled) return theme.colors.disabled;
    return theme.colors.forest;
  };

  const getTextColor = () => {
    if (destructive) return theme.colors.surface;
    return theme.colors.surface;
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getBackgroundColor() }, style]}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: theme.spacing[16],
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
  },
});
