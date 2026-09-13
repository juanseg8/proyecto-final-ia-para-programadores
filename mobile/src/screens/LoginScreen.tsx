import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { AuthContext } from '../AuthContext';

export const LoginScreen = () => {
    const { login } = useContext(AuthContext);
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        // Hack necesario para el entorno de test con React 19 y RNTL v14
        // Evita el error 'overlapping act()' al simular eventos asíncronos rápidos
        queueMicrotask(() => {
            login(emailRef.current, passwordRef.current).catch((e: any) => {
                setError(e.message || 'Error');
            });
        });
    };

    return (
        <View>
            <TextInput placeholder="Email" onChangeText={t => emailRef.current = t} />
            <TextInput placeholder="Password" onChangeText={t => passwordRef.current = t} />
            <Button title="Login" onPress={handleLogin} />
            {error ? <Text>{error}</Text> : null}
        </View>
    );
};
