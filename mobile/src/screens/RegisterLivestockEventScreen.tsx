import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Text } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppInput, SearchableSelect } from '../components';
import { apiClient } from '../apiClient';
import { theme } from '../theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const EVENT_OPTIONS = [
  { label: 'Movimiento', value: 'MOVEMENT' },
  { label: 'Sanidad', value: 'HEALTH' },
  { label: 'Alimentación', value: 'FEEDING' },
  { label: 'Preñez', value: 'PREGNANCY' },
  { label: 'Destete', value: 'WEANING' },
  { label: 'Compra', value: 'PURCHASE' },
  { label: 'Venta', value: 'SALE' },
  { label: 'Muerte', value: 'DEATH' },
  { label: 'Costo', value: 'COST' },
  { label: 'Otro', value: 'OTHER' },
];

const RegisterLivestockEventScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [eventType, setEventType] = useState<any>(null);
  const [date, setDate] = useState(new Date().toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'}));
  const [description, setDescription] = useState('');
  
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const establishmentId = route.params?.establishmentId;
  const herdId = route.params?.herdId;
  const animalIdFromRoute = route.params?.animalId;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/establishments/${establishmentId}/animals`);
      const filteredAnimals = res.data.filter((a: any) => a.herdId === herdId);
      setAnimals(filteredAnimals);
      if (animalIdFromRoute) {
        const found = filteredAnimals.find((a: any) => a.id === animalIdFromRoute);
        if (found) setSelectedAnimal(found);
      }
    } catch (e) {
      console.log('Error loading data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnimal || !eventType) {
      Alert.alert('Error', 'Seleccione un animal y el tipo de evento');
      return;
    }
    try {
      let parsedDate = new Date();
      if (date && date.includes('/')) {
        const [day, month, year] = date.split('/');
        parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      }

      await apiClient.post(`/establishments/${establishmentId}/events`, {
        herdId,
        animalId: selectedAnimal.id,
        type: eventType.value,
        notes: description,
        occurredAt: parsedDate.toISOString(),
      });
      Alert.alert('Éxito', 'Evento registrado correctamente');
      navigation.goBack();
    } catch (err: any) {
      console.log(err.response?.data || err);
      Alert.alert('Error', 'No se pudo registrar el evento');
    }
  };

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title="Registrar Evento" showBack={true} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {loading ? (
             <ActivityIndicator size="large" color={theme.colors.primary[600]} />
          ) : (
            <View style={styles.formContainer}>
              {animalIdFromRoute ? (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 8 }}>Animal seleccionado</Text>
                  <View style={styles.animalRow}>
                    <View style={styles.animalIcon}>
                      <MaterialCommunityIcons name="cow" size={20} color={theme.colors.primary[600]} />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary }}>{selectedAnimal?.tag}</Text>
                  </View>
                </View>
              ) : (
                <SearchableSelect
                  label="Seleccione Animal (Caravana)"
                  items={animals}
                  selectedItem={selectedAnimal}
                  onSelect={setSelectedAnimal}
                  getLabel={(i) => i.tag}
                  placeholder="Buscar caravana..."
                />
              )}

              <SearchableSelect
                label="Tipo de Evento *"
                items={EVENT_OPTIONS}
                selectedItem={eventType}
                onSelect={setEventType}
                getLabel={(i) => i.label}
                placeholder="Seleccione evento"
                searchable={false}
                leftIcon="tag"
              />

              <AppInput
                label="Fecha *"
                value={date}
                onChangeText={setDate}
                placeholder="DD/MM/YYYY"
                leftIcon="calendar"
              />

              <AppInput
                label="Observaciones / Detalle *"
                value={description}
                onChangeText={setDescription}
                placeholder="Detalles del evento..."
                multiline={true}
                leftIcon="file-document-outline"
              />
            </View>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <AppButton title="Guardar Evento" onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  animalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  animalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6EBE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  footer: {
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  }
});

export default RegisterLivestockEventScreen;
