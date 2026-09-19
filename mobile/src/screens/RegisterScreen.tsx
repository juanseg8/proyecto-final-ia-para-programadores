import React, { useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../AuthContext';
import { AppScreen } from '../components/AppScreen';
import { FormField } from '../components/FormField';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { theme } from '../theme/theme';

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
        <AppScreen style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>Agro Intelligence</Text>
                <Text style={styles.subtitle}>Crea una cuenta para comenzar</Text>
            </View>
            <FormField label="Nombre">
                <AppInput 
                    placeholder="Nombre" 
                    onChangeText={t => nameRef.current = t}
                    accessibilityLabel="Nombre" 
                />
            </FormField>
            <FormField label="Correo electrónico">
                <AppInput 
                    placeholder="Correo electrónico" 
                    onChangeText={t => emailRef.current = t} 
                    accessibilityLabel="Correo electrónico"
                />
            </FormField>
            <FormField label="Contraseña">
                <AppInput 
                    placeholder="Contraseña" 
                    onChangeText={t => passwordRef.current = t} 
                    secureTextEntry
                    accessibilityLabel="Contraseña"
                />
            </FormField>
            <View style={styles.buttonContainer}>
                <AppButton title="Crear cuenta" onPress={handleRegister} />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </AppScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing[24],
        justifyContent: 'center',
    },
    header: {
        marginBottom: theme.spacing[32],
        alignItems: 'center',
    },
    logo: {
        ...theme.typography.display,
        color: theme.colors.forest,
        marginBottom: theme.spacing[8],
        textAlign: 'center',
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: theme.spacing[24],
    },
    errorText: {
        ...theme.typography.bodySmall,
        color: theme.colors.error,
        marginTop: theme.spacing[16],
        textAlign: 'center',
    }
});
