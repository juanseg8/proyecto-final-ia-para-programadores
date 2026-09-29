import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { AppButton } from './AppButton';
import { theme } from '../theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  onLocationSelected: (location: { latitude: number; longitude: number }) => void;
  mapCenter?: { latitude: number; longitude: number } | null;
  onCurrentLocationRequested?: () => void;
}

const MapLocationPicker: React.FC<Props> = ({ onLocationSelected, mapCenter, onCurrentLocationRequested }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: -34.603722,
    longitude: -58.381592,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  React.useEffect(() => {
    if (mapCenter) {
      setRegion({
        ...region,
        latitude: mapCenter.latitude,
        longitude: mapCenter.longitude,
      });
    }
  }, [mapCenter]);

  const handleConfirm = () => {
    onLocationSelected({ latitude: region.latitude, longitude: region.longitude });
    setModalVisible(false);
  };

  const handleUseCurrentLocation = async () => {
    if (onCurrentLocationRequested) {
      onCurrentLocationRequested();
    } else {
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
      } catch (error) {
        // Catch error
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <AppButton title="Abrir Mapa" onPress={() => setModalVisible(true)} />
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccione la ubicación</Text>
            <Text style={styles.modalSubtitle}>Mueva el mapa para apuntar al campo</Text>
          </View>
          <View style={{ flex: 1 }}>
            <MapView
              style={styles.map}
              mapType="none"
              region={region}
              onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
            >
              <UrlTile
                urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />
            </MapView>
            <View style={styles.markerFixed}>
              <MaterialCommunityIcons name="map-marker" size={48} color={theme.colors.primary[800]} />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <AppButton
              title="Confirmar ubicación"
              onPress={handleConfirm}
              style={styles.buttonSpacing}
            />
            <AppButton
              title="Usar mi ubicación actual"
              onPress={handleUseCurrentLocation}
              style={styles.buttonSpacing}
            />
            <AppButton
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing[12],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  map: {
    flex: 1,
  },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
  },
  buttonContainer: {
    padding: theme.spacing[24],
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  buttonSpacing: {
    marginBottom: theme.spacing[12],
  },
  cancelButton: {
    backgroundColor: theme.colors.semantic.error,
  },
});

export default MapLocationPicker;
