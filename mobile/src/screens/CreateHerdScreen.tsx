import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppInput } from '../components';
import { apiClient } from '../apiClient';
import theme from '../theme/theme';

const CreateHerdScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [name, setName] = useState('');
  const [activity, setActivity] = useState('');
  const [productionSystem, setProductionSystem] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const establishmentId = route.params?.establishmentId;

  const handleSubmit = async () => {
    if (!name || !activity || !productionSystem) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post(`/establishments/${establishmentId}/herds`, {
        name,
        activity,
        productionSystem,
        active,
      });
      navigation.goBack();
    } catch (err) {
      setError('Error al crear el rodeo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <AppHeader title="Crear Rodeo" />
      <ScrollView style={styles.container}>
        {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
        <AppInput
          label="Nombre del Rodeo"
          value={name}
          onChangeText={setName}
          placeholder="Ej: Rodeo Principal"
        />
        <AppInput
          label="Actividad"
          value={activity}
          onChangeText={setActivity}
          placeholder="CRIA | RECRIA | ENGORDE"
        />
        <AppInput
          label="Sistema de Producción"
          value={productionSystem}
          onChangeText={setProductionSystem}
          placeholder="PASTOREO | SEMI_INTENSIVO | INTENSIVO"
        />
        <View style={styles.checkboxContainer}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>Estado Activo</Text>
          <AppButton
            title={active ? 'Activo' : 'Inactivo'}
            onPress={() => setActive(!active)}
            style={styles.checkboxButton}
          />
        </View>
        <AppButton
          title="Crear Rodeo"
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing[16],
  },
  error: {
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing[16],
    textAlign: 'center',
  },
  label: {
    fontSize: theme.typography.label.fontSize,
    marginBottom: theme.spacing[8],
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[16],
  },
  checkboxButton: {
    minWidth: 100,
  },
  submitButton: {
    marginTop: theme.spacing[24],
  },
});

export default CreateHerdScreen;
