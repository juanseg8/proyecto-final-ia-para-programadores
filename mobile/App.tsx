import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from './src/theme/theme';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import EstablishmentListScreen from './src/screens/EstablishmentListScreen';
import EstablishmentDetailScreen from './src/screens/EstablishmentDetailScreen';
import EstablishmentFormScreen from './src/screens/EstablishmentFormScreen';
import LivestockScreen from './src/screens/LivestockScreen';
import CreateHerdScreen from './src/screens/CreateHerdScreen';
import HerdDetailScreen from './src/screens/HerdDetailScreen';
import CreateAnimalScreen from './src/screens/CreateAnimalScreen';
import RegisterWeighingScreen from './src/screens/RegisterWeighingScreen';
import RegisterLivestockEventScreen from './src/screens/RegisterLivestockEventScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import IndicatorsScreen from './src/screens/IndicatorsScreen';
import BenchmarkScreen from './src/screens/BenchmarkScreen';

import AgroAiScreen from './src/screens/AgroAiScreen';
import AnimalDetailScreen from './src/screens/AnimalDetailScreen';
import { MainTabNavigator } from './src/navigation/MainTabNavigator';
import { AuthProvider, useAuth } from './src/AuthContext';
import { EstablishmentProvider } from './src/EstablishmentContext';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[600]} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="EstablishmentDetail" component={EstablishmentDetailScreen} />
          <Stack.Screen name="EstablishmentForm" component={EstablishmentFormScreen} />
          <Stack.Screen name="Livestock" component={LivestockScreen} />
          <Stack.Screen name="CreateHerd" component={CreateHerdScreen} />
          <Stack.Screen name="HerdDetail" component={HerdDetailScreen} />
          <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
          <Stack.Screen name="CreateAnimal" component={CreateAnimalScreen} />
          <Stack.Screen name="RegisterWeighing" component={RegisterWeighingScreen} />
          <Stack.Screen name="RegisterLivestockEvent" component={RegisterLivestockEventScreen} />
          <Stack.Screen name="Alerts" component={AlertsScreen} />
          <Stack.Screen name="Indicators" component={IndicatorsScreen} />
          <Stack.Screen name="Benchmark" component={BenchmarkScreen} />
          <Stack.Screen name="AgroAi" component={AgroAiScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <EstablishmentProvider>
        <SafeAreaProvider style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </EstablishmentProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
