import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppButton, AppInput, BrandLogo } from '../components';
import { theme } from '../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleRecover = () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresá tu correo electrónico.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Correo enviado', 
        'Te enviamos un enlace para restablecer tu contraseña.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }, 1500);
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

          <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: 250 }}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.title}>Recuperar cuenta</Text>
              <Text style={styles.subtitle}>
                Ingresá tu correo y te enviaremos{'\n'}
                las instrucciones para recuperar tu acceso.
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
                style={{ marginBottom: 16 }}
              />

              <AppButton 
                title="Enviar enlace" 
                onPress={handleRecover} 
                style={styles.actionButton}
                disabled={loading}
                rightIcon="arrow-right"
              />

              <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkHighlight}>Volver a iniciar sesión</Text>
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

export default ForgotPasswordScreen;
