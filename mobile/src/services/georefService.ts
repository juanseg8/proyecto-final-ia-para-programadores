import axios from 'axios';

export interface Province {
  id: string;
  nombre: string;
}

export interface Locality {
  id: string;
  nombre: string;
}

export const georefService = {
  getProvinces: async (): Promise<Province[]> => {
    const response = await axios.get('https://apis.datos.gob.ar/georef/api/provincias');
    return response.data.provincias.sort((a: Province, b: Province) => a.nombre.localeCompare(b.nombre));
  },
  getLocalities: async (provinceName: string): Promise<Locality[]> => {
    const response = await axios.get(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(provinceName)}&max=1000`);
    return response.data.localidades.sort((a: Locality, b: Locality) => a.nombre.localeCompare(b.nombre));
  }
};
