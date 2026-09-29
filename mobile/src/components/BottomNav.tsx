import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const BottomNav = ({ navigation }: { navigation: any }) => {
  const route = useRoute();
  
  const getIconColor = (screenName: string) => {
    return route.name === screenName ? theme.colors.primary[600] : theme.colors.textSecondary;
  };
  
  const getTextColor = (screenName: string) => {
    return route.name === screenName ? theme.colors.primary[600] : theme.colors.textSecondary;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home-outline" size={24} color={getIconColor('Home')} />
        <Text style={[styles.text, { color: getTextColor('Home') }]}>Inicio</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EstablishmentList')}
      >
        <MaterialCommunityIcons name="barn" size={24} color={getIconColor('EstablishmentList')} />
        <Text style={[styles.text, { color: getTextColor('EstablishmentList') }]}>Establecimientos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {}}
      >
        <Ionicons name="stats-chart" size={24} color={getIconColor('Indicators')} />
        <Text style={[styles.text, { color: getTextColor('Indicators') }]}>Indicadores</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {}}
      >
        <Ionicons name="ellipsis-horizontal" size={24} color={getIconColor('More')} />
        <Text style={[styles.text, { color: getTextColor('More') }]}>Más</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomNav;
