import React, { useState, useContext, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../AuthContext';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { theme } from '../theme/theme';

interface LoginScreenProps {
  onGoToRegister?: () => void;
}

export const LoginScreen = ({ onGoToRegister }: LoginScreenProps) => {
  const { login } = useContext(AuthContext);
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError('');
    setLoading(true);
    queueMicrotask(() => {
      login(emailRef.current, passwordRef.current)
        .catch((e: any) => {
          setError(e.message || 'Error al iniciar sesiÃ³n');
        })
        .finally(() => setLoading(false));
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoIconRow}>
            <Text style={styles.leafEmoji}>ðŸŒ¿</Text>
            <Text style={styles.logoText}>Agro Intelligence</Text>
          </View>
          <Text style={styles.logoSubtitle}>DATOS PARA UN CAMPO MÃS EFICIENTE</Text>
        </View>

        {/* Heading */}
        <View style={styles.headingArea}>
          <Text style={styles.heading}>Bienvenido nuevamente</Text>
          <Text style={styles.subheading}>
            AccedÃ© para gestionar y analizar{'\n'}la informaciÃ³n de tu establecimiento.
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formCard}>
          <AppInput
            placeholder="Correo electronico"
            placeholderTextColor={theme.colors.textSecondary}
            onChangeText={t => (emailRef.current = t)}
            accessibilityLabel="Correo electronico"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Text style={styles.inputIcon}>✉</Text>}
          />
          <View style={styles.inputSpacer} />
          <AppInput
            placeholder="Contrasena"
            placeholderTextColor={theme.colors.textSecondary}
            onChangeText={t => (passwordRef.current = t)}
            accessibilityLabel="Contrasena"
            secureTextEntry={!showPassword}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            rightIcon={
              <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁'}</Text>
            }
            onRightIconPress={() => setShowPassword(v => !v)}
          />
        </View>

        {/* Error */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* BotÃ³n principal */}
        <View style={styles.buttonContainer}>
          <AppButton
            title="Iniciar sesiÃ³n â†’"
            onPress={handleLogin}
            loading={loading}
            accessibilityLabel="Iniciar sesiÃ³n"
          />
        </View>

        {/* Links */}
        <View style={styles.linksRow}>
          <Text style={styles.linkText}>Â¿No tenÃ©s una cuenta?</Text>
          <TouchableOpacity onPress={onGoToRegister} accessibilityRole="link">
            <Text style={styles.linkAction}> Crear cuenta</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.forgotContainer} accessibilityRole="link">
          <Text style={styles.forgotText}>Â¿Olvidaste tu Contraseña?</Text>
        </TouchableOpacity>

        {/* Footer con gradiente */}
        <LinearGradient
          colors={[theme.colors.forest, theme.colors.primaryLight]}
          style={styles.footer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.footerQuote}>
            "Una gestiÃ³n mÃ¡s simple{'\n'}para un campo mÃ¡s productivo."
          </Text>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: theme.spacing[24],
    paddingBottom: theme.spacing[40],
    backgroundColor: theme.colors.background,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: theme.spacing[32],
    marginTop: theme.spacing[16],
  },
  logoIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  leafEmoji: {
    fontSize: 28,
    marginRight: theme.spacing[8],
  },
  logoText: {
    ...theme.typography.h1,
    color: theme.colors.forest,
    fontWeight: '700',
  },
  logoSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.leaf,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  headingArea: {
    marginBottom: theme.spacing[24],
  },
  heading: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    marginBottom: theme.spacing[8],
  },
  subheading: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing[16],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing[16],
  },
  inputSpacer: {
    height: theme.spacing[12],
  },
  inputIcon: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorText: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    marginBottom: theme.spacing[8],
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: theme.spacing[16],
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing[8],
  },
  linkText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  linkAction: {
    ...theme.typography.bodySmall,
    color: theme.colors.forest,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  forgotContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[32],
  },
  forgotText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textDecorationLine: 'underline',
  },
  footer: {
    borderRadius: theme.radius.card,
    padding: theme.spacing[24],
    marginTop: theme.spacing[8],
  },
  footerQuote: {
    ...theme.typography.body,
    color: theme.colors.surface,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
});

