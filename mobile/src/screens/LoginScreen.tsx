// entire file content ...
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppScreen, AppHeader, AppButton, FormField } from '../components';
import { useTheme } from 'styled-components/native';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

  const handleLogin = () => {
    // Login logic would go here
    console.log('Login attempt with:', email, password);
    navigation.navigate('Home');
  };

  return (
    <AppScreen>
      <AppHeader title="Iniciar Sesión" />
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Iniciar Sesión</Text>
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
        <AppButton title="Iniciar Sesión" onPress={handleLogin} />
        <AppButton
          title="Registrarse"
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
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
  registerButton: {
    marginTop: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default LoginScreen;
