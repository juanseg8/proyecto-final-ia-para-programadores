// entire file content ...
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

const AppHeader = ({ title }: { title: string }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.forest }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AppHeader;
