// entire file content ...
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import theme from './src/theme/theme';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import EstablishmentListScreen from './src/screens/EstablishmentListScreen';
import EstablishmentDetailScreen from './src/screens/EstablishmentDetailScreen';
import EstablishmentFormScreen from './src/screens/EstablishmentFormScreen';
import BottomNav from './src/components/BottomNav';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="EstablishmentList" component={EstablishmentListScreen} />
            <Stack.Screen name="EstablishmentDetail" component={EstablishmentDetailScreen} />
            <Stack.Screen name="EstablishmentForm" component={EstablishmentFormScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
