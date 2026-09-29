import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppInput } from '../components';
import { SearchableSelect } from '../components/SearchableSelect';
import { apiClient } from '../apiClient';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

const ACTIVITY_OPTIONS = [
  { id: 'CRIA', label: 'Cría' },
  { id: 'RECRIA', label: 'Recría' },
  { id: 'ENGORDE', label: 'Engorde' }
];

const SYSTEM_OPTIONS = [
  { id: 'PASTOREO', label: 'Pastoreo' },
  { id: 'SEMI_INTENSIVO', label: 'Semi-Intensivo' },
  { id: 'INTENSIVO', label: 'Intensivo' }
];

const CreateHerdScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [name, setName] = useState('');
  const [activity, setActivity] = useState<any>(null);
  const [productionSystem, setProductionSystem] = useState<any>(null);
  const [active, setActive] = useState(true);
  const [notes, setNotes] = useState('');
  
  const establishmentId = route.params?.establishmentId;

  const handleSubmit = async () => {
    try {
      await apiClient.post(`/establishments/${establishmentId}/herds`, {
        name,
        activity: activity?.id,
        productionSystem: productionSystem?.id,
        active,
        notes,
      });
      navigation.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title="Nuevo Rodeo" showBack={true} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.formContainer}>
            <AppInput
              label="Nombre del Rodeo"
              value={name}
              onChangeText={setName}
              placeholder="Ej: Lote 1 - Invernada"
              leftIcon="tag-text-outline"
            />
            <SearchableSelect
              label="Actividad"
              items={ACTIVITY_OPTIONS}
              selectedItem={activity}
              onSelect={setActivity}
              getLabel={(item) => item.label}
              placeholder="Seleccioná una actividad"
              searchable={false}
              leftIcon="clipboard-list-outline"
            />
            <SearchableSelect
              label="Sistema de Producción"
              items={SYSTEM_OPTIONS}
              selectedItem={productionSystem}
              onSelect={setProductionSystem}
              getLabel={(item) => item.label}
              placeholder="Seleccioná el sistema"
              searchable={false}
              leftIcon="sprout-outline"
            />
            
            <AppInput
              label="Notas (Opcional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Ej: Lote de recría alimentado a pasto"
              multiline
              numberOfLines={3}
              leftIcon="note-text-outline"
            />
            
            <Text style={styles.label}>Estado del Rodeo</Text>
            <TouchableOpacity 
              style={styles.toggleBtn}
              onPress={() => setActive(!active)}
            >
              <View style={[styles.toggleIndicator, { backgroundColor: active ? theme.colors.primary[600] : theme.colors.textSecondary }]} />
              <Text style={styles.toggleText}>{active ? 'Activo (En Producción)' : 'Inactivo (Cerrado)'}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
        <View style={styles.footer}>
          <AppButton title="Crear Rodeo" onPress={handleSubmit} />
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
  label: {
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  toggleText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  }
});

export default CreateHerdScreen;
