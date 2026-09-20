// entire file content ...
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

const AppButton = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  destructive = false,
}: {
  title: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  destructive?: boolean;
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    if (destructive) return theme.colors.error;
    if (disabled) return theme.colors.disabled;
    return theme.colors.primary;
  };

  const getTextColor = () => {
    if (destructive) return '#FFFFFF';
    return theme.colors.text;
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getBackgroundColor() }, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppButton;
