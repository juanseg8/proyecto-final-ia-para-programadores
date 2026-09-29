import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useEstablishment } from '../EstablishmentContext';
import { apiClient } from '../apiClient';

interface Establishment {
  id: string;
  name: string;
}

const EstablishmentSelector = () => {
  const { selectedEstablishmentId, selectEstablishment, clearSelection } = useEstablishment();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEstablishments = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/establishments');
        const ests = res.data;
        setEstablishments(ests);
        
        if (selectedEstablishmentId && !ests.find((e: any) => String(e.id) === String(selectedEstablishmentId))) {
          clearSelection();
        }
      } catch (e) {
        // error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchEstablishments();
  }, []);

  const selectedName = establishments.find(e => String(e.id) === String(selectedEstablishmentId))?.name || 'Seleccionar Campo';

  if (loading && establishments.length === 0) {
    return <ActivityIndicator size="small" color={theme.colors.primary[600]} />;
  }

  if (establishments.length === 0) {
    return <Text style={styles.noData}>No hay campos</Text>;
  }

  return (
    <>
      <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
        <Ionicons name="location-outline" size={16} color={theme.colors.primary[700]} />
        <Text style={styles.selectorText} numberOfLines={1}>{selectedName}</Text>
        <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar Establecimiento</Text>
            <FlatList
              data={establishments}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, String(selectedEstablishmentId) === String(item.id) && styles.itemSelected]}
                  onPress={() => {
                    selectEstablishment(String(item.id));
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.itemText, String(selectedEstablishmentId) === String(item.id) && styles.itemTextSelected]}>
                    {item.name}
                  </Text>
                  {String(selectedEstablishmentId) === String(item.id) && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary[700]} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    maxWidth: 120,
  },
  selectorText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.primary[800],
    marginHorizontal: 4,
    flexShrink: 1,
  },
  noData: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemSelected: {
    backgroundColor: theme.colors.primary[50],
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  itemText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textPrimary,
  },
  itemTextSelected: {
    fontWeight: 'bold',
    color: theme.colors.primary[700],
  },
});

export default EstablishmentSelector;
