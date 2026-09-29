import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { AppButton } from './AppButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
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
  leftIcon,
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
    setSearchText(getLabel(item));
    setModalVisible(false);
  };

  const handleFocus = () => {
    if (!disabled) {
      setModalVisible(true);
      if (selectedItem) setSearchText(getLabel(selectedItem));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {leftIcon && (
          <View style={{ paddingLeft: 12, justifyContent: 'center' }}>
            <MaterialCommunityIcons name={leftIcon} size={24} color={theme.colors.neutral[500]} />
          </View>
        )}
        <TextInput
          style={[styles.input, disabled && styles.inputDisabled]}
          placeholder={placeholder}
          value={modalVisible ? searchText : (selectedItem ? getLabel(selectedItem) : '')}
          onChangeText={(text) => {
            setSearchText(text);
            if (!modalVisible) setModalVisible(true);
          }}
          onFocus={handleFocus}
          editable={!disabled && searchable}
          placeholderTextColor={theme.colors.textSecondary}
        />
        <TouchableOpacity 
          style={styles.iconContainer} 
          onPress={() => {
            if (!disabled) {
              setModalVisible(!modalVisible);
            }
          }}
        >
          <Ionicons name={modalVisible ? "chevron-up" : "chevron-down"} size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {modalVisible && (
        <ScrollView style={styles.dropdownContainer} nestedScrollEnabled={true}>
          {loading ? (
            <ActivityIndicator size="small" style={{padding: 16}} color={theme.colors.primary[600]} />
          ) : filteredItems.length === 0 ? (
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
      )}
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.surface,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing[16],
    paddingVertical: theme.spacing[12],
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textPrimary,
  },
  inputDisabled: {
    backgroundColor: '#F5F7F5',
    color: theme.colors.textSecondary,
  },
  iconContainer: {
    padding: 12,
  },
  dropdownContainer: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.surface,
    maxHeight: 200,
    overflow: 'hidden',
  },
  item: {
    padding: theme.spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7F5',
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
