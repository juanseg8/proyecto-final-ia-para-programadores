import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppButton, AppInput, BrandLogo } from '../components';
import { theme } from '../theme/theme';
import { useAuth } from '../AuthContext';
import { Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresá tu email y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (e: any) {
      Alert.alert('Error de inicio de sesión', e.response?.data?.message || 'Verificá tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Math.max(insets.top, 20) }
          ]} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.logoContainer}>
            <BrandLogo variant="full" width={100} height={80} />
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>
              Accedé para gestionar y analizar{'\n'}
              la información de tu establecimiento.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <AppInput
              label="Correo electrónico"
              placeholder="productor@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email-outline"
              style={{ marginBottom: 12 }}
            />

            <AppInput
              label="Contraseña"
              placeholder="••••••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon="lock-outline"
              style={{ marginBottom: 16 }}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <MaterialCommunityIcons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={theme.colors.neutral[500]} 
                  />
                </TouchableOpacity>
              }
            />

            <AppButton 
              title="Iniciar sesión" 
              onPress={handleLogin} 
              style={styles.loginButton}
              disabled={loading}
              rightIcon="arrow-right"
            />

            <View style={styles.linksContainer}>
              <View style={styles.linkRow}>
                <Text style={styles.linkText}>¿No tenés una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.linkHighlight}>Crear cuenta</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.linkHighlight}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Absolute positioned background image at the bottom, behind content */}
      <View style={styles.backgroundImageContainer} pointerEvents="none">
        <Image 
          source={require('../../assets/rural-bg.jpg')} 
          style={styles.backgroundImage} 
          resizeMode="cover" 
        />
        <LinearGradient
          colors={['#FFF9F0', 'rgba(255, 249, 240, 0)']}
          style={styles.gradientOverlay}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF9F0', // warm ivory matching the reference
  },
  container: {
    flex: 1,
    zIndex: 1, // ensure content is above the background image
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl, // 24px
    alignItems: 'center', // Center everything horizontally
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
  },
  welcomeContainer: {
    marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0B2136', // Dark blueish black from reference
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#5C6E7A', // Greyish blue
    lineHeight: 26,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400, // To look good on tablets too
  },
  loginButton: {
    width: '100%',
    marginTop: 8,
    marginBottom: 32,
  },
  linksContainer: {
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: '#3B4D5C',
    fontSize: 16,
  },
  linkHighlight: {
    color: theme.colors.primary[800], // Dark green matching button
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  forgotPassword: {
    alignItems: 'center',
  },
  backgroundImageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.35, // take up bottom 35%
    zIndex: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  }
});

export default LoginScreen;
