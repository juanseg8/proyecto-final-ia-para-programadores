import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Button } from 'react-native';
import { apiClient } from '../apiClient';
import MapLocationPicker from '../components/MapLocationPicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppScreen } from '../components/AppScreen';
import { FormField } from '../components/FormField';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { AppInput } from '../components/AppInput';
import { theme } from '../theme/theme';
import { georefService, Province, Locality } from '../services/georefService';

export const EstablishmentFormScreen = () => {
  const route = useRoute();
  console.log('RENDER', route);
  const navigation = useNavigation();
  const params = route.params as { id?: string } | undefined;
  const isEditing = !!params?.id;

  const [name, setName] = useState('');
  const [province, setProvince] = useState('');
  const [locality, setLocality] = useState('');
  const [surface, setSurface] = useState('');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(isEditing);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [geoError, setGeoError] = useState('');
  
  const [showProvModal, setShowProvModal] = useState(false);
  const [showLocModal, setShowLocModal] = useState(false);

  const nameRef = useRef(name);
  const provRef = useRef(province);
  const locRef = useRef(locality);
  const surRef = useRef(surface);
  const locRefObj = useRef(location);

  const loadProvinces = async () => {
    setGeoError('');
    try {
      const data = await georefService.getProvinces();
      setProvinces(data);
    } catch (e) {
      setGeoError('Error al cargar provincias');
    }
  };

  const loadLocalities = async (provName: string) => {
    console.log(`loadLocalities CALLED with ${provName}`);
    if (!provName) {
      setLocalities([]);
      return;
    }
    try {
      const data = await georefService.getLocalities(provName);
      console.log(`loadLocalities RESOLVED with data for ${provName}`);
      setLocalities(data);
      console.log(`loadLocalities STATE UPDATED for ${provName}`);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  useEffect(() => {
    if (isEditing) {
      apiClient.get(`/establishments/${params.id}`).then(res => {
        const est = res.data;
        setName(est.name || '');
        nameRef.current = est.name || '';
        setProvince(est.province || '');
        provRef.current = est.province || '';
        setLocality(est.locality || '');
        locRef.current = est.locality || '';
        const surf = est.superficieHa !== undefined ? String(est.superficieHa) : '';
        setSurface(surf);
        surRef.current = surf;
        if (est.latitude !== undefined && est.longitude !== undefined) {
          const loc = { latitude: est.latitude, longitude: est.longitude };
          setLocation(loc);
          locRefObj.current = loc;
        }
        if (est.province) {
          loadLocalities(est.province);
        }
      }).catch(err => {
        setErrorMessage('Error al cargar el establecimiento');
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [isEditing, params?.id]);

  const handleSave = async () => {
    setErrorMessage('');
    try {
      const superficieHa = Number(surRef.current);
      const payload = {
        name: nameRef.current,
        province: provRef.current,
        locality: locRef.current,
        superficieHa: isNaN(superficieHa) ? 0 : superficieHa,
        latitude: locRefObj.current.latitude,
        longitude: locRefObj.current.longitude,
      };

      if (isEditing) {
        await apiClient.put(`/establishments/${params.id}`, payload);
      } else {
        await apiClient.post('/establishments', payload);
      }
      if (navigation.goBack) navigation.goBack();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ocurrió un error inesperado');
      }
    }
  };

  const selectProvince = (provName: string) => {
    setProvince(provName);
    provRef.current = provName;
    setLocality('');
    locRef.current = '';
    setShowProvModal(false);
    loadLocalities(provName);
  };

  const selectLocality = (locName: string) => {
    setLocality(locName);
    locRef.current = locName;
    setShowLocModal(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <AppScreen>
      <AppHeader
        title={isEditing ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}
        showBack={true}
        onBack={() => { if (navigation.goBack) navigation.goBack(); }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        
        {geoError ? (
          <View style={{ marginBottom: theme.spacing[12] }}>
            <Text style={styles.errorText}>{geoError}</Text>
            <AppButton title="Reintentar" onPress={loadProvinces} />
          </View>
        ) : null}

        <FormField label="Nombre">
          <AppInput
            accessibilityLabel="Nombre"
            placeholder="Nombre"
            value={name}
            onChangeText={(t) => { setName(t); nameRef.current = t; }}
          />
        </FormField>
        
        <FormField label="Superficie">
          <View style={styles.surfaceContainer}>
            <AppInput
              accessibilityLabel="Superficie"
              style={styles.surfaceInput}
              placeholder="Superficie"
              value={surface}
              onChangeText={(t) => { setSurface(t); surRef.current = t; }}
              keyboardType="numeric"
            />
            <Text style={styles.surfaceUnit}>ha</Text>
          </View>
        </FormField>

        <Text style={styles.sectionTitle}>Ubicación</Text>

        <AppButton 
          title="Obtener por GPS" 
          onPress={() => {}} 
          style={{ marginBottom: theme.spacing[16], backgroundColor: theme.colors.primaryLight }}
          accessibilityLabel="Usar GPS"
        />

        <FormField label="Provincia">
          <TouchableOpacity
            testID="province-selector"
            onPress={() => setShowProvModal(true)}
          >
            <AppInput
              placeholder="Seleccionar Provincia"
              value={province}
              editable={false}
              pointerEvents="none"
              disabled={false}
            />
          </TouchableOpacity>
        </FormField>
        
        <FormField label="Localidad">
          <TouchableOpacity
            testID="locality-selector"
            onPress={() => {
              if (province) setShowLocModal(true);
            }}
            disabled={!province}
            accessibilityState={{ disabled: !province }}
          >
            <AppInput
              placeholder="Seleccionar Localidad"
              value={locality}
              editable={false}
              pointerEvents="none"
              disabled={!province}
            />
          </TouchableOpacity>
        </FormField>
        
        <MapLocationPicker
          onLocationSelected={(loc) => { setLocation(loc); locRefObj.current = loc; }}
        />
        
        <AppButton title="Guardar" onPress={handleSave} style={{ marginTop: theme.spacing[24] }} />

        {/* Modals inline to avoid RTL Modal issues */}
        {showProvModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Provincia</Text>
              <ScrollView>
                {provinces.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.modalItem} onPress={() => selectProvince(item.nombre)}>
                    <Text style={styles.modalItemText}>{item.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Button title="Cerrar" onPress={() => setShowProvModal(false)} />
            </View>
          </View>
        )}

        {showLocModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Localidad</Text>
              <ScrollView>
                {localities.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.modalItem} onPress={() => selectLocality(item.nombre)}>
                    <Text style={styles.modalItemText}>{item.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Button title="Cerrar" onPress={() => setShowLocModal(false)} />
            </View>
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: theme.spacing[16],
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.forest,
    marginTop: theme.spacing[24],
    marginBottom: theme.spacing[16],
  },
  surfaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surfaceInput: {
    flex: 1,
  },
  surfaceUnit: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing[12],
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing[12],
    borderRadius: theme.radius.input,
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: theme.spacing[12],
    ...theme.typography.body,
  },
  modalOverlay: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    maxHeight: 200,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
  }
});
