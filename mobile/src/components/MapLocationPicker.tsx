import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

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
    } catch (error) {
      // Catch error without fatal notification, allowing manual movement
    }
  };

  return (
    <View style={styles.wrapper}>
      {!modalVisible && (
        <Button title="Abrir Mapa" onPress={() => setModalVisible(true)} />
      )}
      {modalVisible && (
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          >
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
          </MapView>
          <View style={styles.buttonContainer}>
            <Button title="Usar mi ubicación actual" onPress={handleUseCurrentLocation} />
            <Button title="Confirmar ubicación" onPress={handleConfirm} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  container: {
    height: 300,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
});

export default MapLocationPicker;
