import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { AppButton } from './AppButton';
import { theme } from '../theme/theme';

interface Props {
  onLocationSelected: (location: { latitude: number; longitude: number }) => void;
}

const MapLocationPicker: React.FC<Props> = ({ onLocationSelected }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: -34.603722,
    longitude: -58.381592,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleConfirm = () => {
    onLocationSelected({ latitude: region.latitude, longitude: region.longitude });
    setModalVisible(false);
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
      // If permission denied, continue without error - manual selection remains available
    } catch (error) {
      // Catch error without fatal notification, allowing manual movement
    }
  };

  return (
    <View style={styles.wrapper}>
      {!modalVisible && (
        <AppButton title="Abrir Mapa" onPress={() => setModalVisible(true)} />
      )}
      {modalVisible && (
        <View style={styles.container}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          >
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
          </MapView>
          <View style={styles.buttonContainer}>
            <AppButton
              title="Usar mi ubicación actual"
              onPress={handleUseCurrentLocation}
              style={styles.buttonSpacing}
            />
            <AppButton
              title="Confirmar ubicación"
              onPress={handleConfirm}
              style={styles.buttonSpacing}
            />
            <AppButton
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing[12],
  },
  container: {
    height: 350,
    marginTop: theme.spacing[8],
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    padding: theme.spacing[16],
    backgroundColor: theme.colors.surface,
  },
  buttonSpacing: {
    marginBottom: theme.spacing[8],
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
});

export default MapLocationPicker;
