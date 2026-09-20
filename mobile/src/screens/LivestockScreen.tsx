import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppCard, BottomNav } from '../components';
import { apiClient } from '../apiClient';
import theme from '../theme/theme';

const LivestockScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [herds, setHerds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const establishmentId = route.params?.establishmentId;

  useEffect(() => {
    const fetchHerds = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/establishments/${establishmentId}/herds`);
        setHerds(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los rodeos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (establishmentId) {
      fetchHerds();
    }
  }, [establishmentId]);

  const handleDelete = async (herdId: string) => {
    try {
      await apiClient.delete(`/establishments/${establishmentId}/herds/${herdId}`);
      setHerds(herds.filter(herd => herd.id !== herdId));
    } catch (err) {
      setError('Error al eliminar el rodeo');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <AppScreen>
        <AppHeader title="Gestión Ganadera" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.forest} />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <AppHeader title="Gestión Ganadera" />
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Rodeos</Text>
        {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
        <FlatList
          data={herds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppCard title={item.name}>
              <Text style={[styles.text, { color: theme.colors.textPrimary }]}>Actividad: {item.activity}</Text>
              <Text style={[styles.text, { color: theme.colors.textPrimary }]}>Sistema: {item.productionSystem}</Text>
              <Text style={[styles.text, { color: theme.colors.textPrimary }]}>Estado: {item.active ? 'Activo' : 'Inactivo'}</Text>
              <View style={styles.buttonContainer}>
                <AppButton
                  title="Ver Detalles"
                  onPress={() => navigation.navigate('HerdDetail', { establishmentId, herdId: item.id })}
                  style={styles.button}
                />
                <AppButton
                  title="Eliminar"
                  onPress={() => handleDelete(item.id)}
                  destructive={true}
                  style={styles.button}
                />
              </View>
            </AppCard>
          )}
        />
        <AppButton
          title="Agregar Rodeo"
          onPress={() => navigation.navigate('CreateHerd', { establishmentId })}
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
    padding: theme.spacing[16],
  },
  title: {
    fontSize: theme.typography.h2.fontSize,
    marginBottom: theme.spacing[16],
  },
  text: {
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing[8],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[16],
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing[8],
  },
  addButton: {
    marginTop: theme.spacing[16],
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

export default LivestockScreen;
