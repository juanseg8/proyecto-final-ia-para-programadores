import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppCard } from '../components';
import { apiClient } from '../apiClient';
import theme from '../theme/theme';

const HerdDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [herd, setHerd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const establishmentId = route.params?.establishmentId;
  const herdId = route.params?.herdId;

  useEffect(() => {
    const fetchHerd = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/establishments/${establishmentId}/herds/${herdId}`);
        setHerd(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los detalles del rodeo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (establishmentId && herdId) {
      fetchHerd();
    }
  }, [establishmentId, herdId]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await apiClient.put(`/establishments/${establishmentId}/herds/${herdId}`, herd);
      navigation.goBack();
    } catch (err) {
      setError('Error al actualizar el rodeo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !herd) {
    return (
      <AppScreen>
        <AppHeader title="Detalle del Rodeo" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.forest} />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <AppHeader title="Detalle del Rodeo" />
      <ScrollView style={styles.container}>
        {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
        <AppCard title={herd?.name || ''}>
          <Text style={[styles.text, { color: theme.colors.textPrimary }]}>Actividad: {herd?.activity}</Text>
          <Text style={[styles.text, { color: theme.colors.textPrimary }]}>Sistema de Producción: {herd?.productionSystem}</Text>
          <Text style={[styles.text, { color: theme.colors.textPrimary }]}>Estado: {herd?.active ? 'Activo' : 'Inactivo'}</Text>
          <Text style={[styles.text, { color: theme.colors.textPrimary }]}>Creado: {new Date(herd?.createdAt).toLocaleDateString()}</Text>
          <Text style={[styles.text, { color: theme.colors.textPrimary }]}>Actualizado: {new Date(herd?.updatedAt).toLocaleDateString()}</Text>
        </AppCard>
        <View style={styles.buttonContainer}>
          <AppButton
            title="Editar Rodeo"
            onPress={() => navigation.navigate('CreateHerd', { establishmentId, herdId })}
            style={styles.button}
          />
          <AppButton
            title="Volver"
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
  text: {
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing[8],
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing[16],
    textAlign: 'center',
  },
});

export default HerdDetailScreen;
