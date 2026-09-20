// entire file content ...
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppCard, BottomNav } from '../components';
import { useTheme } from 'styled-components/native';

const EstablishmentListScreen = ({ navigation }: { navigation: any }) => {
  const theme = useTheme();

  // Mock data - in a real app this would come from an API
  const establishments = [
    { id: '1', name: 'Granja Los Ángeles', type: 'Granja', address: 'Calle 123, Ciudad' },
    { id: '2', name: 'Hacienda San José', type: 'Hacienda', address: 'Avenida 456, Pueblo' },
    { id: '3', name: 'Finca El Roble', type: 'Finca', address: 'Carrera 789, Campo' },
  ];

  return (
    <AppScreen>
      <AppHeader title="Establecimientos" />
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Lista de Establecimientos</Text>
        <FlatList
          data={establishments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppCard title={item.name}>
              <Text style={[styles.text, { color: theme.colors.text }]}>Tipo: {item.type}</Text>
              <Text style={[styles.text, { color: theme.colors.text }]}>Dirección: {item.address}</Text>
              <AppButton
                title="Ver Detalles"
                onPress={() => navigation.navigate('EstablishmentDetail', { establishment: item })}
              />
            </AppCard>
          )}
        />
        <AppButton
          title="Agregar Establecimiento"
          onPress={() => navigation.navigate('EstablishmentForm')}
          style={styles.addButton}
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
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  addButton: {
    marginTop: 16,
  },
});

export default EstablishmentListScreen;
