import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from './src/theme/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab icon component usando texto unicode
const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{label}</Text>
);

// Stack para la secciÃ³n de Establecimientos (List â†’ Detail / Form)
const EstablishmentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EstablishmentList" component={EstablishmentListScreen} />
    <Stack.Screen name="EstablishmentForm" component={EstablishmentFormScreen} />
    <Stack.Screen name="EstablishmentDetail" component={EstablishmentDetailScreen} />
  </Stack.Navigator>
);

// Stack para Home (Home â†’ EstablishmentForm directo desde acciones rÃ¡pidas)
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="EstablishmentForm" component={EstablishmentFormScreen} />
  </Stack.Navigator>
);

// Pantalla placeholder para tabs futuros
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
    <Text style={{ ...theme.typography.h3, color: theme.colors.textSecondary }}>
      {title}
    </Text>
    <Text style={{ ...theme.typography.bodySmall, color: theme.colors.textSecondary, marginTop: 8 }}>
      PrÃ³ximamente disponible
    </Text>
  </View>
);

// Bottom Tab Navigator para el Ã¡rea autenticada
const AuthenticatedTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
      },
      tabBarActiveTintColor: theme.colors.forest,
      tabBarInactiveTintColor: theme.colors.textSecondary,
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500',
      },
    })}
  >
    <Tab.Screen
      name="InicioTab"
      component={HomeStack}
      options={{
        tabBarLabel: 'Inicio',
        tabBarIcon: ({ focused }) => <TabIcon label="ðŸ " focused={focused} />,
      }}
    />
    <Tab.Screen
      name="EstablecimientosTab"
      component={EstablishmentStack}
      options={{
        tabBarLabel: 'Establecimientos',
        tabBarIcon: ({ focused }) => <TabIcon label="ðŸ¡" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="IndicadoresTab"
      component={() => <PlaceholderScreen title="Indicadores" />}
      options={{
        tabBarLabel: 'Indicadores',
        tabBarIcon: ({ focused }) => <TabIcon label="ðŸ“Š" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="MasTab"
      component={() => <PlaceholderScreen title="MÃ¡s" />}
      options={{
        tabBarLabel: 'MÃ¡s',
        tabBarIcon: ({ focused }) => <TabIcon label="Â·Â·Â·" focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

const AppContent = () => {
  const { user, isLoading } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: theme.colors.textSecondary }}>Cargando...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <NavigationContainer>
        <AuthenticatedTabs />
        <StatusBar style="auto" />
      </NavigationContainer>
    );
  }

  return (
    <View style={styles.auth}>
      {showRegister ? (
        <RegisterScreen />
      ) : (
        <LoginScreen onGoToRegister={() => setShowRegister(true)} />
      )}
      {showRegister && (
        <View style={styles.switchRow}>
          <Text
            style={styles.switchLink}
            onPress={() => setShowRegister(false)}
          >
            Â¿Ya tenÃ©s cuenta? IniciÃ¡ sesiÃ³n
          </Text>
        </View>
      )}
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
  loading: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auth: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  switchRow: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
  },
  switchLink: {
    ...theme.typography.bodySmall,
    color: theme.colors.primaryLight,
    textDecorationLine: 'underline',
    padding: 8,
  },
});
