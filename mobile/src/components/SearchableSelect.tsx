import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { AppInput } from './AppInput';
import { AppButton } from './AppButton';

interface SearchableSelectProps<T> {
  label: string;
  items: T[];
  selectedItem: T | null;
  onSelect: (item: T) => void;
  onRetry?: () => void;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  getLabel: (item: T) => string;
  placeholder: string;
  searchable?: boolean;
  emptyMessage?: string;
}

export const SearchableSelect = <T,>({
  label,
  items,
  selectedItem,
  onSelect,
  onRetry,
  loading,
  error,
  disabled,
  getLabel,
  placeholder,
  searchable = true,
  emptyMessage = 'No hay opciones disponibles',
}: SearchableSelectProps<T>) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState<T[]>([]);

  useEffect(() => {
    if (searchable) {
      const filtered = items.filter(item =>
        getLabel(item).toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchText, searchable, getLabel]);

  const handleSelect = (item: T) => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <AppInput
          placeholder={placeholder}
          value={selectedItem ? getLabel(selectedItem) : ''}
          editable={false}
          pointerEvents="none"
          style={styles.input}
        />
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {onRetry && (
            <AppButton
              title="Reintentar"
              onPress={onRetry}
              style={styles.retryButton}
            />
          )}
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{label}</Text>
            <AppButton
              title="Cerrar"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <>
              {searchable && (
                <AppInput
                  placeholder="Buscar..."
                  value={searchText}
                  onChangeText={setSearchText}
                  style={styles.searchInput}
                />
              )}

              <ScrollView style={styles.listContainer}>
                {filteredItems.length === 0 ? (
                  <Text style={styles.emptyText}>{emptyMessage}</Text>
                ) : (
                  filteredItems.map((item, index) => (
                    <TouchableOpacity
                      key={`${getLabel(item)}-${index}`}
                      style={styles.item}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={styles.itemText}>{getLabel(item)}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[16],
  },
  label: {
    color: theme.colors.textPrimary,
    ...theme.typography.label,
    marginBottom: theme.spacing[8],
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.surface,
  },
  input: {
    paddingHorizontal: theme.spacing[16],
    paddingVertical: theme.spacing[12],
  },
  errorContainer: {
    marginTop: theme.spacing[8],
  },
  errorText: {
    color: theme.colors.error,
    ...theme.typography.caption,
    marginBottom: theme.spacing[4],
  },
  retryButton: {
    marginTop: theme.spacing[8],
  },
  modalContainer: {
    flex: 1,
    paddingTop: theme.spacing[24],
    backgroundColor: theme.colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[16],
    marginBottom: theme.spacing[16],
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.forest,
  },
  closeButton: {
    minWidth: 80,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  searchInput: {
    marginHorizontal: theme.spacing[16],
    marginBottom: theme.spacing[16],
  },
  listContainer: {
    flex: 1,
  },
  item: {
    padding: theme.spacing[16],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: theme.spacing[24],
  },
});
