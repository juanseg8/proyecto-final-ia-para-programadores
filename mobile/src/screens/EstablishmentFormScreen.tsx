import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
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
import { SearchableSelect } from '../components/SearchableSelect';

export const EstablishmentFormScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as { id?: string } | undefined;
  const isEditing = !!params?.id;

  const [name, setName] = useState('');
  const [province, setProvince] = useState<Province | null>(null);
  const [locality, setLocality] = useState<Locality | null>(null);
  const [surface, setSurface] = useState('');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(isEditing);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [geoError, setGeoError] = useState('');
  const [provincesLoading, setProvincesLoading] = useState(false);
  const [localitiesLoading, setLocalitiesLoading] = useState(false);

  const nameRef = useRef(name);
  const provRef = useRef(province);
  const locRef = useRef(locality);
  const surRef = useRef(surface);
  const locRefObj = useRef(location);

  const loadProvinces = async () => {
    setGeoError('');
    setProvincesLoading(true);
    try {
      const data = await georefService.getProvinces();
      setProvinces(data);
    } catch (e) {
      setGeoError('Error al cargar provincias');
    } finally {
      setProvincesLoading(false);
    }
  };

  const loadLocalities = async (provName: string) => {
    if (!provName) {
      setLocalities([]);
      return;
    }
    setLocalitiesLoading(true);
    try {
      const data = await georefService.getLocalities(provName);
      setLocalities(data);
    } catch (e) {
      // ignore
    } finally {
      setLocalitiesLoading(false);
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
        setProvince(provinces.find(p => p.nombre === est.province) || null);
        provRef.current = provinces.find(p => p.nombre === est.province) || null;
        setLocality(localities.find(l => l.nombre === est.locality) || null);
        locRef.current = localities.find(l => l.nombre === est.locality) || null;
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
  }, [isEditing, params?.id, provinces, localities]);

  const handleSave = async () => {
    setErrorMessage('');
    try {
      const superficieHa = Number(surRef.current);
      const payload = {
        name: nameRef.current,
        province: provRef.current?.nombre || '',
        locality: locRef.current?.nombre || '',
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

  const selectProvince = (prov: Province) => {
    setProvince(prov);
    provRef.current = prov;
    setLocality(null);
    locRef.current = null;
    loadLocalities(prov.nombre);
  };

  const selectLocality = (loc: Locality) => {
    setLocality(loc);
    locRef.current = loc;
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

        <SearchableSelect
          label="Provincia"
          items={provinces}
          selectedItem={province}
          onSelect={selectProvince}
          onRetry={loadProvinces}
          loading={provincesLoading}
          error={geoError}
          getLabel={(item: Province) => item.nombre}
          placeholder="Seleccionar Provincia"
          searchable={true}
        />

        <SearchableSelect
          label="Localidad"
          items={localities}
          selectedItem={locality}
          onSelect={selectLocality}
          loading={localitiesLoading}
          disabled={!province}
          getLabel={(item: Locality) => item.nombre}
          placeholder="Seleccionar Localidad"
          searchable={true}
          emptyMessage={province ? 'Cargando localidades...' : 'Primero seleccione una provincia'}
        />

        <MapLocationPicker
          onLocationSelected={(loc) => { setLocation(loc); locRefObj.current = loc; }}
        />

        <AppButton title="Guardar" onPress={handleSave} style={{ marginTop: theme.spacing[24] }} />
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
  errorText: {
    color: theme.colors.error,
    marginBottom: theme.spacing[12],
    ...theme.typography.body,
  },
});
