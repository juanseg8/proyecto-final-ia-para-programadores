import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { AuthContext } from '../AuthContext';

export const RegisterScreen = () => {
    const { register } = useContext(AuthContext);
    const nameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const [error, setError] = useState('');

    const handleRegister = () => {
        setError('');
        register(nameRef.current, emailRef.current, passwordRef.current).catch((e: any) => {
            setError(e.message || 'Error de registro');
        });
    };

    return (
        <View>
            <TextInput placeholder="Name" onChangeText={t => nameRef.current = t} />
            <TextInput placeholder="Email" onChangeText={t => emailRef.current = t} />
            <TextInput placeholder="Password" onChangeText={t => passwordRef.current = t} />
            <Button title="Register" onPress={handleRegister} />
            {error ? <Text style={{color: 'red', marginTop: 10}}>{error}</Text> : null}
        </View>
    );
};
