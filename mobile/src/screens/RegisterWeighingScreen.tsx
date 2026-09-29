import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text, ActivityIndicator, Alert } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppInput, SearchableSelect } from '../components';
import { apiClient } from '../apiClient';
import { theme } from '../theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RegisterWeighingScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'}));
  const [notes, setNotes] = useState('');
  const [animals, setAnimals] = useState<any[]>([]);
  const [weighings, setWeighings] = useState<any[]>([]);
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
      const [animalsRes, weighingsRes] = await Promise.all([
        apiClient.get(`/establishments/${establishmentId}/animals`),
        apiClient.get(`/establishments/${establishmentId}/weighings`)
      ]);
      const filteredAnimals = animalsRes.data.filter((a: any) => a.herdId === herdId);
      setAnimals(filteredAnimals);
      setWeighings(weighingsRes.data);
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
    if (!selectedAnimal || !weight) {
      Alert.alert('Error', 'Seleccione animal e ingrese el peso');
      return;
    }
    try {
      // Parse date string DD/MM/YYYY to ISO
      let parsedDate = new Date();
      if (date && date.includes('/')) {
        const [day, month, year] = date.split('/');
        parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      }

      await apiClient.post(`/establishments/${establishmentId}/weighings`, {
        herdId,
        animalId: selectedAnimal.id,
        weightKg: parseFloat(weight),
        weighedAt: parsedDate.toISOString(),
        notes: notes || null
      });
      Alert.alert('Éxito', 'Pesada registrada');
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'No se pudo registrar la pesada');
    }
  };

  const animalHistory = weighings.filter((w) => w.animalId === selectedAnimal?.id);

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title="Registrar Pesada" showBack={true} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {loading ? (
             <ActivityIndicator size="large" color={theme.colors.primary[600]} />
          ) : (
            <>
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

                <AppInput
                  label="Peso (kg) *"
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="Ej: 350"
                  keyboardType="numeric"
                  leftIcon="weight"
                />
                
                <AppInput
                  label="Fecha *"
                  value={date}
                  onChangeText={setDate}
                  placeholder="DD/MM/YYYY"
                  leftIcon="calendar"
                />

                <AppInput
                  label="Observaciones (opcional)"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Ej: Condición corporal, manejo, observaciones..."
                  multiline={true}
                  leftIcon="file-document-outline"
                />
              </View>

              {selectedAnimal && (
                <View style={styles.historyContainer}>
                  <Text style={styles.historyTitle}>Historial de Pesadas - {selectedAnimal.tag}</Text>
                  {animalHistory.length === 0 ? (
                    <Text style={styles.historyEmpty}>No hay registros anteriores.</Text>
                  ) : (
                    animalHistory.map((w, index) => (
                      <View key={index} style={styles.historyRow}>
                        <Text style={styles.historyDate}>{new Date(w.weighedAt).toLocaleDateString()}</Text>
                        <Text style={styles.historyWeight}>{w.weightKg} kg</Text>
                      </View>
                    ))
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <AppButton title="Guardar Pesada" onPress={handleSubmit} />
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
    marginBottom: 24,
  },
  historyContainer: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  historyEmpty: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  historyDate: {
    color: theme.colors.textPrimary,
  },
  historyWeight: {
    fontWeight: 'bold',
    color: theme.colors.primary[600],
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

export default RegisterWeighingScreen;
