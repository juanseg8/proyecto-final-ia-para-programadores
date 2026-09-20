// entire file content ...
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

const BottomNav = ({ navigation }: { navigation: any }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={[styles.text, { color: theme.colors.text }]}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EstablishmentList')}
      >
        <Text style={[styles.text, { color: theme.colors.text }]}>Establecimientos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    padding: 8,
  },
  text: {
    fontSize: 14,
  },
});

export default BottomNav;
