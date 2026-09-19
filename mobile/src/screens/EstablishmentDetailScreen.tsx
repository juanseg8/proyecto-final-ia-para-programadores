import React, { useState, useCallback } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { apiClient } from '../apiClient';
import { AppScreen } from '../components/AppScreen';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { ConfirmDialog } from '../components/feedback';
import { theme } from '../theme/theme';

export const EstablishmentDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp<any>>();
    const { id } = route.params as { id: string };
    
    const [establishment, setEstablishment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchEst = async () => {
                try {
                    const res = await apiClient.get(`/establishments/${id}`);
                    setEstablishment(res.data);
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        Alert.alert('No se pudo cargar', 'No tienes permiso para ver este establecimiento.');
                        navigation.goBack();
                    } else {
                        Alert.alert('No se pudo cargar', 'Ocurrió un problema inesperado.');
                        navigation.goBack();
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchEst();
        }, [id])
    );

    const handleDelete = () => {
        setShowConfirmDelete(true);
    };

    const confirmDelete = async () => {
        try {
            await apiClient.delete(`/establishments/${id}`);
            setShowConfirmDelete(false);
            navigation.goBack();
        } catch (error: any) {
            setShowConfirmDelete(false);
            if (error.response?.status === 404) {
                Alert.alert('No se pudo eliminar', 'No tienes permiso para eliminar este establecimiento.');
            } else {
                Alert.alert('No se pudo eliminar', 'Ocurrió un problema inesperado.');
            }
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" testID="loading-indicator" />;
    }

    if (!establishment) {
        return null;
    }

    return (
        <AppScreen>
            <AppCard>
                <Text style={styles.title}>{establishment.name}</Text>
                <Text>{establishment.locality}, {establishment.province}</Text>
                <Text>{establishment.superficieHa !== undefined && establishment.superficieHa !== null ? `${establishment.superficieHa} ha` : ''}</Text>
            </AppCard>

            <AppButton title="Editar" onPress={() => navigation.navigate('EstablishmentForm', { id })} />
            <AppButton title="Eliminar" onPress={handleDelete} style={{ backgroundColor: theme.colors.error }} />

            {showConfirmDelete && (
                <ConfirmDialog 
                    title="Eliminar"
                    message="¿Estás seguro?"
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirmDelete(false)}
                    isDestructive={true}
                />
            )}
        </AppScreen>
    );
};

const styles = StyleSheet.create({
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 }
});
