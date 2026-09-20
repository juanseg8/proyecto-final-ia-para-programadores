import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppInput, AppCard, Feedback } from '../components';
import { apiClient } from '../apiClient';
import theme from '../theme/theme';

const RegisterWeighingScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [weighing, setWeighing] = useState({
    weightKg: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const establishmentId = route.params?.establishmentId;
  const herdId = route.params?.herdId;
  const animalId = route.params?.animalId;

  const handleChange = (name: string, value: string) => {
    setWeighing(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!weighing.weightKg) {
      setError('El peso es obligatorio');
      return;
    }

    const weight = parseFloat(weighing.weightKg);
    if (isNaN(weight) || weight <= 0) {
      setError('El peso debe ser un número positivo');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await apiClient.post(`/establishments/${establishmentId}/weighings`, {
        ...weighing,
        establishmentId,
        herdId,
        animalId,
        weightKg: weight,
      });

      setSuccess('Pesaje registrado correctamente');
      setWeighing({ weightKg: '', notes: '' });
    } catch (err) {
      setError('Error al registrar el pesaje');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <AppHeader title="Registrar Pesaje" />
      <ScrollView style={styles.container}>
        {error && <Feedback type="error" message={error} />}
        {success && <Feedback type="success" message={success} />}

        <AppCard title="Datos del Pesaje">
          <AppInput
            label="Peso (kg)"
            value={weighing.weightKg}
            onChangeText={(text) => handleChange('weightKg', text)}
            placeholder="Ingrese el peso en kg"
            keyboardType="numeric"
          />
          <AppInput
            label="Notas"
            value={weighing.notes}
            onChangeText={(text) => handleChange('notes', text)}
            placeholder="Notas adicionales (opcional)"
            multiline
          />
        </AppCard>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Registrar Pesaje"
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

export default RegisterWeighingScreen;
