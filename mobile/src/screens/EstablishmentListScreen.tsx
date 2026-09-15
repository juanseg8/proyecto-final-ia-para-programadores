import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../apiClient';

interface Establishment {
    id: string;
    name: string;
    province: string;
}

export const EstablishmentListScreen = () => {
    const navigation = useNavigation<any>();
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEstablishments = async () => {
            try {
                const response = await apiClient.get('/establishments');
                setEstablishments(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEstablishments();
    }, []);

    if (loading) {
        return <View><Text>Loading...</Text></View>;
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Button 
                title="+ Nuevo establecimiento" 
                onPress={() => navigation.navigate('NewEstablishment')} 
            />
            {establishments.length === 0 ? (
                <Text>No tienes establecimientos</Text>
            ) : (
                <FlatList
                    data={establishments}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('EstablishmentDetail', { id: item.id })}
                            style={{ padding: 16, borderBottomWidth: 1 }}
                        >
                            <Text>{item.name}</Text>
                            <Text>{item.province}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};
