// entire file content ...
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppCard, BottomNav } from '../components';
import theme from '../theme/theme';

const EstablishmentDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { establishment } = route.params;

  return (
    <AppScreen>
      <AppHeader title="Detalle del Establecimiento" />
      <View style={styles.container}>
        <AppCard title={establishment.name}>
          <Text style={[styles.text, { color: theme.colors.textPrimary }]}>Tipo: {establishment.type}</Text>
          <Text style={[styles.text, { color: theme.colors.textPrimary }]}>Dirección: {establishment.address}</Text>
        </AppCard>
        <AppButton
          title="Editar Establecimiento"
          onPress={() => navigation.navigate('EstablishmentForm', { establishment })}
        />
        <AppButton
          title="Eliminar Establecimiento"
          onPress={() => console.log('Delete establishment:', establishment.id)}
          style={styles.deleteButton}
          destructive
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
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  deleteButton: {
    marginTop: 16,
  },
});

export default EstablishmentDetailScreen;
