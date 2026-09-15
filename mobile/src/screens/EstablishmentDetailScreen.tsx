import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { apiClient } from '../apiClient';

export const EstablishmentDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp<any>>();
    const { id } = route.params as { id: string };
    
    const [establishment, setEstablishment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEst = async () => {
            try {
                const res = await apiClient.get(`/establishments/${id}`);
                setEstablishment(res.data);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    Alert.alert('Error', 'No tienes permiso para ver este establecimiento.');
                    navigation.goBack();
                } else {
                    Alert.alert('Error', 'Error inesperado.');
                    navigation.goBack();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEst();
    }, [id]);

    const handleDelete = () => {
        Alert.alert('Eliminar', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            { 
                text: 'Eliminar', 
                style: 'destructive', 
                onPress: async () => {
                    try {
                        await apiClient.delete(`/establishments/${id}`);
                        navigation.goBack();
                    } catch (error: any) {
                        if (error.response?.status === 404) {
                            Alert.alert('Error', 'No tienes permiso para eliminar este establecimiento.');
                        } else {
                            Alert.alert('Error', 'Error inesperado.');
                        }
                    }
                } 
            }
        ]);
    };

    if (loading) {
        return <ActivityIndicator size="large" testID="loading-indicator" />;
    }

    if (!establishment) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{establishment.name}</Text>
            <Text>{establishment.province}</Text>
            <Text>{establishment.locality}</Text>
            <Text>{establishment.superficieHa !== undefined && establishment.superficieHa !== null ? String(establishment.superficieHa) : ''}</Text>

            <Button title="Editar" onPress={() => navigation.navigate('EstablishmentForm', { id })} />
            <Button title="Eliminar" onPress={handleDelete} color="red" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 }
});
