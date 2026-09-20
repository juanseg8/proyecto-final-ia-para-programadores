// entire file content ...
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

const Feedback = ({ type, message }: { type: 'success' | 'error' | 'info'; message: string }) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.info;
    }
  };

  const getTextColor = () => {
    return '#FFFFFF';
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={[styles.text, { color: getTextColor() }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
  },
});

export default Feedback;
