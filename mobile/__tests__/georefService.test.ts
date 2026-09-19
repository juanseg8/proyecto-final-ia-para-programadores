import { georefService } from '../src/services/georefService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('georefService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getProvinces returns a list of provinces', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        provincias: [
          { id: '06', nombre: 'Buenos Aires' },
          { id: '14', nombre: 'Córdoba' }
        ]
      }
    });

    const provinces = await georefService.getProvinces();
    
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('provincias'));
    expect(provinces).toHaveLength(2);
    expect(provinces[0]).toHaveProperty('id', '06');
    expect(provinces[0]).toHaveProperty('nombre', 'Buenos Aires');
  });

  it('getLocalities returns a list of localities for a given province id or name', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        localidades: [
          { id: '0600001', nombre: 'Tandil' },
          { id: '0600002', nombre: 'Mar del Plata' }
        ]
      }
    });

    const localities = await georefService.getLocalities('06');
    
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('localidades'));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('provincia=06'));
    expect(localities).toHaveLength(2);
    expect(localities[0]).toHaveProperty('id', '0600002');
    expect(localities[0]).toHaveProperty('nombre', 'Mar del Plata');
  });

  it('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
    
    await expect(georefService.getProvinces()).rejects.toThrow('Network error');
  });
});
