import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './src/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';

const AppContent = () => {
  const { user, isLoading } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <HomeScreen />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showRegister ? <RegisterScreen /> : <LoginScreen />}
      <Button 
        title={showRegister ? "Ya tengo cuenta (Login)" : "Crear cuenta nueva"} 
        onPress={() => setShowRegister(!showRegister)} 
      />
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
