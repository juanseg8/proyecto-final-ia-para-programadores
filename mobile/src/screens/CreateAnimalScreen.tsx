import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text, TouchableOpacity, Alert } from 'react-native';
import { AppScreen, AppHeader, AppButton, AppInput, SearchableSelect } from '../components';
import { apiClient } from '../apiClient';
import { theme } from '../theme/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SEX_OPTIONS = [
  { label: 'Macho', value: 'M' },
  { label: 'Hembra', value: 'F' }
];

const CATEGORY_OPTIONS = [
  { label: 'Ternero/a', value: 'TERNERO' },
  { label: 'Novillo', value: 'NOVILLO' },
  { label: 'Vaquillona', value: 'VAQUILLONA' },
  { label: 'Vaca', value: 'VACA' },
  { label: 'Toro', value: 'TORO' },
];

const CreateAnimalScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [visualId, setVisualId] = useState('');
  const [category, setCategory] = useState<any>(null);
  const [sex, setSex] = useState<any>(null);
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const establishmentId = route.params?.establishmentId;
  const herdId = route.params?.herdId;

  const handleSubmit = async () => {
    if (!visualId || !sex) {
      Alert.alert('Error', 'Caravana visual y sexo son obligatorios');
      return;
    }
    try {
      await apiClient.post(`/establishments/${establishmentId}/animals`, {
        herdId,
        tag: visualId,
        sex: sex.value,
        birthDate: birthDate,
      });
      Alert.alert('Éxito', 'Animal registrado correctamente');
      navigation.goBack();
    } catch (err: any) {
      console.log(err.response?.data || err);
      Alert.alert('Error', 'No se pudo registrar el animal');
    }
  };

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title="Alta de Animal" showBack={true} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <AppInput
              label="Caravana Visual"
              value={visualId}
              onChangeText={setVisualId}
              placeholder="Ej: A-1234"
              leftIcon="tag"
            />
            
            <SearchableSelect
              label="Categoría"
              items={CATEGORY_OPTIONS}
              selectedItem={category}
              onSelect={setCategory}
              getLabel={(i) => i.label}
              placeholder="Seleccione categoría"
              searchable={false}
              leftIcon="cow"
            />

            <SearchableSelect
              label="Sexo"
              items={SEX_OPTIONS}
              selectedItem={sex}
              onSelect={setSex}
              getLabel={(i) => i.label}
              placeholder="Seleccione sexo"
              searchable={false}
              leftIcon="gender-male-female"
            />

            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialCommunityIcons name="calendar" size={24} color={theme.colors.textSecondary} style={{marginRight: 12}} />
              <Text style={styles.dateText}>
                {birthDate.toLocaleDateString('es-AR')}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setBirthDate(selectedDate);
                  }
                }}
              />
            )}
            
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <AppButton title="Registrar Animal" onPress={handleSubmit} />
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
    color: theme.colors.textPrimary,
    ...theme.typography.label,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  dateText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textPrimary,
  },
  footer: {
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  }
});

export default CreateAnimalScreen;
