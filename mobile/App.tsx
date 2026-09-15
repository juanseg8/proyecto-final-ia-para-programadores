import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './src/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { EstablishmentListScreen } from './src/screens/EstablishmentListScreen';
import { EstablishmentFormScreen } from './src/screens/EstablishmentFormScreen';
import { EstablishmentDetailScreen } from './src/screens/EstablishmentDetailScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

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
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EstablishmentList" component={EstablishmentListScreen} />
          <Stack.Screen name="NewEstablishment" component={EstablishmentFormScreen} />
          <Stack.Screen name="EstablishmentDetail" component={EstablishmentDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
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
