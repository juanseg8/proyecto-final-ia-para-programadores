import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from './AuthContext';

interface EstablishmentContextType {
  selectedEstablishmentId: string | null;
  selectEstablishment: (id: string) => Promise<void>;
  clearSelection: () => Promise<void>;
}

export const EstablishmentContext = createContext<EstablishmentContextType>({} as EstablishmentContextType);

export const EstablishmentProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string | null>(null);

  useEffect(() => {
    const loadSelection = async () => {
      if (isAuthenticated) {
        const savedId = await SecureStore.getItemAsync('selectedEstablishmentId');
        if (savedId) {
          setSelectedEstablishmentId(savedId);
        }
      } else {
        setSelectedEstablishmentId(null);
      }
    };
    loadSelection();
  }, [isAuthenticated]);

  const selectEstablishment = async (id: string) => {
    await SecureStore.setItemAsync('selectedEstablishmentId', id.toString());
    setSelectedEstablishmentId(id);
  };

  const clearSelection = async () => {
    await SecureStore.deleteItemAsync('selectedEstablishmentId');
    setSelectedEstablishmentId(null);
  };

  return (
    <EstablishmentContext.Provider value={{ selectedEstablishmentId, selectEstablishment, clearSelection }}>
      {children}
    </EstablishmentContext.Provider>
  );
};

export const useEstablishment = () => useContext(EstablishmentContext);
