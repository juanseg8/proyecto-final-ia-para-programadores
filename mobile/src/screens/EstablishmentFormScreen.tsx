import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, Text } from 'react-native';
import * as Location from 'expo-location';
import { AppScreen, AppHeader, AppButton, AppInput, SearchableSelect } from '../components';
import MapLocationPicker from '../components/MapLocationPicker';
import { theme } from '../theme/theme';
import { georefService, Province, Locality } from '../services/georefService';
import { apiClient } from '../apiClient';

const ACTIVITIES = [{ nombre: 'CRIA' }, { nombre: 'RECRIA' }, { nombre: 'ENGORDE' }];
const SYSTEMS = [{ nombre: 'EXTENSIVO' }, { nombre: 'SEMI_INTENSIVO' }, { nombre: 'INTENSIVO' }];

const EstablishmentFormScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [name, setName] = useState('');
  const [superficieHa, setSuperficieHa] = useState('');
  
  const [activity, setActivity] = useState<{ nombre: string } | null>(null);
  const [productionSystem, setProductionSystem] = useState<{ nombre: string } | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(null);
  
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [mapCenter, setMapCenter] = useState<{latitude: number; longitude: number} | null>(null);
  
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!route.params?.establishment;

  useEffect(() => {
    loadProvinces();
    if (isEdit) {
      const { establishment } = route.params;
      setName(establishment.name);
      setSuperficieHa(establishment.superficieHa?.toString() || '');
      setActivity(ACTIVITIES.find(a => a.nombre === establishment.activity) || null);
      setProductionSystem(SYSTEMS.find(s => s.nombre === establishment.productionSystem) || null);
      if (establishment.latitude && establishment.longitude) {
        setLocation({ latitude: Number(establishment.latitude), longitude: Number(establishment.longitude) });
        setMapCenter({ latitude: Number(establishment.latitude), longitude: Number(establishment.longitude) });
      }
    }
  }, [route.params]);

  useEffect(() => {
    if (isEdit && provinces.length > 0 && !selectedProvince) {
      const { establishment } = route.params;
      if (establishment.province) {
        const provSearch = establishment.province.toLowerCase().trim();
        const matchedProv = provinces.find(p => p.nombre.toLowerCase().trim() === provSearch || p.nombre.toLowerCase().includes(provSearch));
        if (matchedProv) {
          setSelectedProvince(matchedProv);
          setLoadingLocalities(true);
          georefService.getLocalities(matchedProv.nombre).then(locs => {
            setLocalities(locs);
            if (establishment.locality) {
              const locSearch = establishment.locality.toLowerCase().trim();
              const matchedLoc = locs.find(l => l.nombre.toLowerCase().trim() === locSearch || l.nombre.toLowerCase().includes(locSearch));
              if (matchedLoc) setSelectedLocality(matchedLoc);
            }
          }).finally(() => setLoadingLocalities(false));
        }
      }
    }
  }, [provinces, isEdit, route.params, selectedProvince]);

  const loadProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const data = await georefService.getProvinces();
      setProvinces(data);
    } catch (e) {
      console.log('Error loading provinces', e);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadLocalities = async (provinceName: string) => {
    setLoadingLocalities(true);
    try {
      const data = await georefService.getLocalities(provinceName);
      setLocalities(data);
    } catch (e) {
      console.log('Error loading localities', e);
    } finally {
      setLoadingLocalities(false);
    }
  };

  const handleSelectProvince = (prov: Province) => {
    setSelectedProvince(prov);
    setSelectedLocality(null);
    setLocalities([]);
    loadLocalities(prov.nombre);
    
    // Set map center approximation for province
    if (prov.centroide) {
      setMapCenter({ latitude: prov.centroide.lat, longitude: prov.centroide.lon });
    }
  };

  const handleSelectLocality = (loc: Locality) => {
    setSelectedLocality(loc);
    // Set map center approximation for locality
    if (loc.centroide) {
      setMapCenter({ latitude: loc.centroide.lat, longitude: loc.centroide.lon });
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se pudo obtener la ubicación. Por favor seleccione manualmente.');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      const coords = { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude };
      setLocation(coords);
      setMapCenter(coords);

      const reverseGeocode = await Location.reverseGeocodeAsync(coords);
      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        // Try to match province and locality
        if (place.region) {
          const matchedProv = provinces.find(p => p.nombre.toLowerCase().includes(place.region!.toLowerCase()) || place.region!.toLowerCase().includes(p.nombre.toLowerCase()));
          if (matchedProv) {
            setSelectedProvince(matchedProv);
            const locs = await georefService.getLocalities(matchedProv.nombre);
            setLocalities(locs);
            if (place.city) {
              const matchedLoc = locs.find(l => l.nombre.toLowerCase().includes(place.city!.toLowerCase()) || place.city!.toLowerCase().includes(l.nombre.toLowerCase()));
              if (matchedLoc) setSelectedLocality(matchedLoc);
            }
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al obtener la ubicación actual.');
    }
  };

  const handleSubmit = async () => {
    if (!name || !superficieHa || !selectedProvince || !selectedLocality || !location || !activity || !productionSystem) {
      Alert.alert('Error', 'Por favor completá todos los campos y seleccioná la ubicación.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        superficieHa: parseFloat(superficieHa),
        province: selectedProvince.nombre,
        locality: selectedLocality.nombre,
        latitude: location.latitude,
        longitude: location.longitude,
        activity: activity.nombre,
        productionSystem: productionSystem.nombre,
      };

      if (isEdit) {
        await apiClient.put(`/establishments/${route.params.establishment.id}`, payload);
      } else {
        await apiClient.post('/establishments', payload);
      }
      
      navigation.navigate('Mis Campos');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'No se pudo guardar el establecimiento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Establecimiento',
      '¿Estás seguro de que deseás eliminar este establecimiento? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            setSubmitting(true);
            try {
              await apiClient.delete(`/establishments/${route.params.establishment.id}`);
              navigation.navigate('Mis Campos');
            } catch (e: any) {
              Alert.alert('Error', e.response?.data?.message || 'No se pudo eliminar el establecimiento.');
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title={isEdit ? 'Editar Campo' : 'Nuevo Campo'} showBack={true} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.formContainer}>
            <AppInput
              label="Nombre del campo *"
              placeholder="Ej: La Esmeralda"
              value={name}
              onChangeText={setName}
              leftIcon="barn"
            />
            
            <AppInput
              label="Superficie (Hectáreas) *"
              placeholder="Ej: 500"
              value={superficieHa}
              onChangeText={setSuperficieHa}
              keyboardType="numeric"
              leftIcon="ruler-square"
            />
            
            <SearchableSelect<{nombre: string}>
              label="Actividad Principal *"
              placeholder="Seleccionar Actividad"
              items={ACTIVITIES}
              selectedItem={activity}
              onSelect={setActivity}
              getLabel={(item) => item.nombre}
              leftIcon="briefcase-outline"
            />

            <SearchableSelect<{nombre: string}>
              label="Sistema de Producción *"
              placeholder="Seleccionar Sistema"
              items={SYSTEMS}
              selectedItem={productionSystem}
              onSelect={setProductionSystem}
              getLabel={(item) => item.nombre}
              leftIcon="tractor"
            />

            <SearchableSelect<Province>
              label="Provincia *"
              placeholder="Seleccionar Provincia"
              items={provinces}
              selectedItem={selectedProvince}
              onSelect={handleSelectProvince}
              getLabel={(prov) => prov.nombre}
              loading={loadingProvinces}
              leftIcon="map-marker-outline"
            />

            <SearchableSelect<Locality>
              label="Localidad *"
              placeholder="Seleccionar Localidad"
              items={localities}
              selectedItem={selectedLocality}
              onSelect={handleSelectLocality}
              getLabel={(loc) => loc.nombre}
              loading={loadingLocalities}
              disabled={!selectedProvince}
              leftIcon="map-marker-radius-outline"
            />

            <Text style={styles.label}>Ubicación en Mapa</Text>
            {location?.latitude != null && location?.longitude != null && (
              <Text style={styles.coordText}>Lat: {Number(location.latitude).toFixed(4)}, Lng: {Number(location.longitude).toFixed(4)}</Text>
            )}
            <MapLocationPicker 
              onLocationSelected={setLocation} 
              mapCenter={mapCenter}
              onCurrentLocationRequested={handleUseCurrentLocation}
            />

          </View>

        </ScrollView>
        <View style={styles.footer}>
          <AppButton 
            title={isEdit ? 'Guardar Cambios' : 'Crear Campo'} 
            onPress={handleSubmit} 
            disabled={submitting}
          />
          {isEdit && (
            <AppButton 
              title="Eliminar Campo" 
              onPress={handleDelete} 
              disabled={submitting}
              style={{ marginTop: 8, backgroundColor: theme.colors.semantic.error }}
            />
          )}
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
    marginBottom: theme.spacing[8],
  },
  coordText: {
    color: theme.colors.primary[600],
    fontSize: 12,
    marginBottom: theme.spacing[8],
  },
  footer: {
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  }
});

export default EstablishmentFormScreen;
