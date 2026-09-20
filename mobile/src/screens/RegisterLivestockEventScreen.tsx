// entire file content ...
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppInput, AppCard, Feedback } from '../components';
import { apiClient } from '../apiClient';
import theme from '../theme/theme';

const RegisterLivestockEventScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [event, setEvent] = useState({
    type: 'MOVEMENT',
    occurredAt: '',
    animalCount: '',
    amount: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const establishmentId = route.params?.establishmentId;
  const herdId = route.params?.herdId;
  const animalId = route.params?.animalId;

  const handleChange = (name: string, value: string) => {
    setEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!event.type || !event.occurredAt) {
      setError('Tipo y fecha son obligatorios');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const payload: any = {
        type: event.type,
        occurredAt: event.occurredAt,
        establishmentId,
        herdId: herdId || undefined,
        animalId: animalId || undefined,
      };

      if (event.animalCount) payload.animalCount = parseInt(event.animalCount);
      if (event.amount) payload.amount = parseFloat(event.amount);
      if (event.notes) payload.notes = event.notes;

      await apiClient.post(`/establishments/${establishmentId}/events`, payload);

      setSuccess('Evento registrado correctamente');
      setEvent({
        type: 'MOVEMENT',
        occurredAt: '',
        animalCount: '',
        amount: '',
        notes: '',
      });
    } catch (err) {
      setError('Error al registrar el evento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <AppHeader title="Registrar Evento" />
      <ScrollView style={styles.container}>
        {error && <Feedback type="error" message={error} />}
        {success && <Feedback type="success" message={success} />}

        <AppCard title="Datos del Evento">
          <AppInput
            label="Tipo"
            value={event.type}
            onChangeText={(text) => handleChange('type', text)}
            placeholder="MOVEMENT, HEALTH, FEEDING, PURCHASE, SALE, DEATH, COST, OTHER"
          />
          <AppInput
            label="Fecha"
            value={event.occurredAt}
            onChangeText={(text) => handleChange('occurredAt', text)}
            placeholder="YYYY-MM-DD"
          />
          <AppInput
            label="Cantidad de Animales"
            value={event.animalCount}
            onChangeText={(text) => handleChange('animalCount', text)}
            placeholder="Cantidad (opcional)"
            keyboardType="numeric"
          />
          <AppInput
            label="Monto (ARS)"
            value={event.amount}
            onChangeText={(text) => handleChange('amount', text)}
            placeholder="Monto (opcional)"
            keyboardType="numeric"
          />
          <AppInput
            label="Notas"
            value={event.notes}
            onChangeText={(text) => handleChange('notes', text)}
            placeholder="Notas adicionales (opcional)"
            multiline
          />
        </AppCard>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Registrar Evento"
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

export default RegisterLivestockEventScreen;
