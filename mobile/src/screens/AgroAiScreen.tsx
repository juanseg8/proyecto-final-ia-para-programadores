import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { AppScreen, AppHeader, EstablishmentSelector } from '../components';
import { apiClient } from '../apiClient';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEstablishment } from '../EstablishmentContext';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AgroAiScreen = ({ navigation }: { navigation: any }) => {
  const { selectedEstablishmentId } = useEstablishment();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage: Message = { role: 'user', content: question.trim() };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await apiClient.post(`/establishments/${selectedEstablishmentId}/ai/ask`, {
        question: userMessage.content
      });

      const data = response.data;
      
      let aiContent = '';
      if (data.answer) {
        aiContent = data.answer;
      } else {
        aiContent = `Lo siento, no puedo responder esa pregunta en este momento. ${data.unavailableReason || ''}`;
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiContent }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Ocurrió un error al conectar con Agro IA. Por favor, intente más tarde.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedEstablishmentId) {
    return (
      <AppScreen style={styles.screen}>
        <AppHeader title="Asistente IA" rightElement={<EstablishmentSelector />} />
        <View style={styles.emptyState}>
          <Ionicons name="home-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={styles.emptyTitle}>Seleccioná un establecimiento</Text>
          <Text style={styles.emptyDesc}>Para poder ayudarte, primero seleccioná un establecimiento en la parte superior.</Text>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen style={styles.screen}>
      <AppHeader title="Asistente IA" rightElement={<EstablishmentSelector />} />
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <ScrollView style={styles.messagesContainer} contentContainerStyle={{paddingVertical: 24}}>
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.aiAvatarLarge}>
                <Ionicons name="sparkles" size={32} color={theme.colors.primary[600]} />
              </View>
              <Text style={styles.emptyTitle}>Agro IA</Text>
              <Text style={styles.emptyDesc}>Estoy analizando los indicadores y el clima de tu campo. ¿En qué puedo ayudarte hoy?</Text>
            </View>
          )}

          {messages.map((msg, index) => (
            <View key={index} style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
              {msg.role === 'ai' && (
                <View style={styles.aiAvatarSmall}>
                  <Ionicons name="sparkles" size={12} color={theme.colors.surface} />
                </View>
              )}
              <View 
                style={[
                  styles.messageBubble, 
                  msg.role === 'user' ? styles.userBubble : styles.aiBubble
                ]}
              >
                <Text style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userText : styles.aiText
                ]}>
                  {msg.content}
                </Text>
              </View>
            </View>
          ))}
          
          {loading && (
            <View style={styles.aiRow}>
              <View style={styles.aiAvatarSmall}>
                <Ionicons name="sparkles" size={12} color={theme.colors.surface} />
              </View>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <ActivityIndicator size="small" color={theme.colors.primary[600]} />
              </View>
            </View>
          )}
        </ScrollView>
        
        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={question}
            onChangeText={setQuestion}
            placeholder="Preguntale a Agro IA..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            editable={!loading}
          />
          <TouchableOpacity 
            style={[styles.sendButton, (!question.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleAsk}
            disabled={!question.trim() || loading}
          >
            <Ionicons name="arrow-up" size={20} color={theme.colors.surface} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F5F7F5', // Slightly off-white for chat background
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  aiAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 32,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  aiRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  aiAvatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: theme.colors.primary[600],
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: theme.colors.surface,
  },
  aiText: {
    color: theme.colors.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 48,
    maxHeight: 120,
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginRight: 12,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#A3BFA0',
  }
});

export default AgroAiScreen;
