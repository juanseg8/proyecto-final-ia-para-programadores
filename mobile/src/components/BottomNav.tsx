import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface BottomNavProps {
  navigate: (routeName: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ navigate }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => navigate('Home')}>
        <Text style={styles.label}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => navigate('Establishments')}>
        <Text style={styles.label}>Establecimientos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[8],
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
});
