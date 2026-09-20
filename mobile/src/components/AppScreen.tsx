// entire file content ...
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

const AppScreen = ({ children, style }: { children: React.ReactNode; style?: any }) => {
  return (
    <SafeAreaView style={[styles.container, style, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default AppScreen;
