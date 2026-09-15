import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
    const { logout, user } = useContext(AuthContext);
    const navigation = useNavigation<any>();

    return (
        <View>
            <Text>Bienvenido, {user?.email}</Text>
            <Button title="Mis establecimientos" onPress={() => navigation.navigate('EstablishmentList')} />
            <Button title="Logout" onPress={logout} />
        </View>
    );
};
