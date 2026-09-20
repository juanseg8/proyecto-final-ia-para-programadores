import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppInput, AppCard, Feedback } from '../components';
import { apiClient } from '../apiClient';
import theme from '../theme/theme';

const CreateAnimalScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [animal, setAnimal] = useState({
    tag: '',
    sex: 'M',
    birthDate: '',
    status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const establishmentId = route.params?.establishmentId;
  const herdId = route.params?.herdId;

  const handleChange = (name: string, value: string) => {
    setAnimal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!animal.tag) {
      setError('El tag es obligatorio');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await apiClient.post(`/establishments/${establishmentId}/animals`, {
        ...animal,
        establishmentId,
        herdId,
      });

      setSuccess('Animal creado correctamente');
      setAnimal({ tag: '', sex: 'M', birthDate: '', status: 'ACTIVE' });
    } catch (err) {
      setError('Error al crear el animal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <AppHeader title="Crear Animal" />
      <ScrollView style={styles.container}>
        {error && <Feedback type="error" message={error} />}
        {success && <Feedback type="success" message={success} />}

        <AppCard title="Datos del Animal">
          <AppInput
            label="Tag"
            value={animal.tag}
            onChangeText={(text) => handleChange('tag', text)}
            placeholder="Ingrese el tag del animal"
          />
          <AppInput
            label="Sexo"
            value={animal.sex}
            onChangeText={(text) => handleChange('sex', text)}
            placeholder="M o F"
          />
          <AppInput
            label="Fecha de Nacimiento"
            value={animal.birthDate}
            onChangeText={(text) => handleChange('birthDate', text)}
            placeholder="YYYY-MM-DD"
          />
          <AppInput
            label="Estado"
            value={animal.status}
            onChangeText={(text) => handleChange('status', text)}
            placeholder="ACTIVE, SOLD, DEAD, TRANSFERRED"
          />
        </AppCard>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Crear Animal"
            onPress={handleSubmit}
            disabled={loading}
            style={styles.button}
          />
          <AppButton
            title="Cancelar"
            onPress={() => navigation.goBack()}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing[16],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[24],
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing[8],
  },
});

export default CreateAnimalScreen;
