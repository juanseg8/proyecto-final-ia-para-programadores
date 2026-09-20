// entire file content ...
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppScreen, AppHeader, AppButton, FormField } from '../components';
import { useTheme } from 'styled-components/native';

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const theme = useTheme();

  const handleRegister = () => {
    // Registration logic would go here
    console.log('Registration attempt with:', name, email, password);
    navigation.navigate('Home');
  };

  return (
    <AppScreen>
      <AppHeader title="Registrarse" />
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Registrarse</Text>
        <FormField
          label="Nombre"
          value={name}
          onChangeText={setName}
        />
        <FormField
          label="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
        />
        <FormField
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <FormField
          label="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <AppButton title="Registrarse" onPress={handleRegister} />
        <AppButton
          title="Volver al Inicio de Sesión"
          onPress={() => navigation.navigate('Login')}
          style={styles.backButton}
        />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default RegisterScreen;
