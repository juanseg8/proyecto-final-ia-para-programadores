import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { apiClient } from '../apiClient';
import MapLocationPicker from '../components/MapLocationPicker';
import { useRoute, useNavigation } from '@react-navigation/native';

export const EstablishmentFormScreen = () => {
  const route = useRoute();
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

  const nameRef = useRef(name);
  const provRef = useRef(province);
  const locRef = useRef(locality);
  const surRef = useRef(surface);
  const locRefObj = useRef(location);

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
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ocurrió un error inesperado');
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={(t) => { setName(t); nameRef.current = t; }}
      />
      <TextInput
        style={styles.input}
        placeholder="Provincia"
        value={province}
        onChangeText={(t) => { setProvince(t); provRef.current = t; }}
      />
      <TextInput
        style={styles.input}
        placeholder="Localidad"
        value={locality}
        onChangeText={(t) => { setLocality(t); locRef.current = t; }}
      />
      <TextInput
        style={styles.input}
        placeholder="Superficie"
        value={surface}
        onChangeText={(t) => { setSurface(t); surRef.current = t; }}
        keyboardType="numeric"
      />
      
      <MapLocationPicker
        onLocationSelected={(loc) => { setLocation(loc); locRefObj.current = loc; }}
      />
      
      <Button title="Guardar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  }
});
