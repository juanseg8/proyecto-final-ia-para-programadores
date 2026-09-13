import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../AuthContext';

export const HomeScreen = () => {
    const { logout, user } = useContext(AuthContext);

    return (
        <View>
            <Text>Bienvenido, {user?.email}</Text>
            <Button title="Logout" onPress={logout} />
        </View>
    );
};
