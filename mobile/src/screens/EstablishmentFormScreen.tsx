// entire file content ...
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppScreen, AppHeader, AppButton, FormField, BottomNav } from '../components';
import { useTheme } from 'styled-components/native';

const EstablishmentFormScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (route.params?.establishment) {
      const { establishment } = route.params;
      setName(establishment.name);
      setType(establishment.type);
      setAddress(establishment.address);
    }
  }, [route.params]);

  const handleSubmit = () => {
    const establishmentData = {
      name,
      type,
      address,
    };
    console.log('Form submission:', establishmentData);
    navigation.navigate('EstablishmentList');
  };

  return (
    <AppScreen>
      <AppHeader title={route.params?.establishment ? 'Editar Establecimiento' : 'Agregar Establecimiento'} />
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {route.params?.establishment ? 'Editar Establecimiento' : 'Agregar Establecimiento'}
        </Text>
        <FormField
          label="Nombre"
          value={name}
          onChangeText={setName}
        />
        <FormField
          label="Tipo"
          value={type}
          onChangeText={setType}
        />
        <FormField
          label="Dirección"
          value={address}
          onChangeText={setAddress}
        />
        <AppButton title="Guardar" onPress={handleSubmit} />
        <AppButton
          title="Cancelar"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
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
    marginBottom: 24,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default EstablishmentFormScreen;
