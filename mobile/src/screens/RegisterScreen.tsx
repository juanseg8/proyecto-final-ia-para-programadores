import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppButton, AppInput, BrandLogo } from '../components';
import { theme } from '../theme/theme';
import { useAuth } from '../AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const insets = useSafeAreaInsets();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completá todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (e: any) {
      Alert.alert('Error de registro', e.response?.data?.message || 'Ocurrió un error al crear la cuenta.');
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
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Completá tus datos para empezar a gestionar{'\n'}
              la información de tu establecimiento.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <AppInput
              label="Nombre completo"
              placeholder="Ej. Juan Pérez"
              value={name}
              onChangeText={setName}
              leftIcon="account-outline"
              style={{ marginBottom: 12 }}
            />
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
              style={{ marginBottom: 12 }}
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
            <AppInput
              label="Confirmar Contraseña"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              leftIcon="lock-outline"
              style={{ marginBottom: 16 }}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <MaterialCommunityIcons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={theme.colors.neutral[500]} 
                  />
                </TouchableOpacity>
              }
            />

            <AppButton 
              title="Registrarse" 
              onPress={handleRegister} 
              style={styles.actionButton}
              disabled={loading}
              rightIcon="arrow-right"
            />

            <View style={styles.linksContainer}>
              <View style={styles.linkRow}>
                <Text style={styles.linkText}>¿Ya tenés una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkHighlight}>Iniciar sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
      
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
    backgroundColor: '#FFF9F0',
  },
  container: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  welcomeContainer: {
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B2136',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#5C6E7A',
    lineHeight: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  actionButton: {
    width: '100%',
    marginTop: 0,
    marginBottom: 16,
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
    color: theme.colors.primary[800],
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  backgroundImageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.35,
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

export default RegisterScreen;
