// entire file content ...
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppScreen, AppHeader, AppButton, BottomNav } from '../components';
import { theme } from '../theme/theme';

const HomeScreen = ({ navigation }: { navigation: any }) => {

  return (
    <AppScreen>
      <AppHeader title="Inicio" />
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Bienvenido</Text>
        <AppButton
          title="Ver Establecimientos"
          onPress={() => navigation.navigate('EstablishmentList')}
        />
      </View>
      <BottomNav navigation={navigation} />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
});

export default HomeScreen;
