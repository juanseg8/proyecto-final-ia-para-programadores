import { apiClient } from '../src/apiClient';
import MockAdapter from 'axios-mock-adapter';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

describe('apiClient F01 - Interceptor and Refresh Token logic', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(apiClient);
        jest.clearAllMocks();
    });

    afterEach(() => {
        mock.restore();
    });

    it('should append Authorization header if access token exists in SecureStore', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('access-token-123');
        mock.onGet('/protected-route').reply(200, { data: 'ok' });

        const response = await apiClient.get('/protected-route');

        expect(response.config.headers?.Authorization).toBe('Bearer access-token-123');
    });

    it('should transparently call /auth/refresh on 401, update tokens, and retry original request', async () => {
        (SecureStore.getItemAsync as jest.Mock)
            .mockResolvedValueOnce('old-access-token')
            .mockResolvedValueOnce('valid-refresh-token'); // for refresh call

        // Setup mock: first call returns 401
        mock.onGet('/protected-route').replyOnce(401);
        
        // Refresh call
        mock.onPost('/auth/refresh').reply(200, {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
            user: { id: 1, email: 'test@test.com' }
        });

        // Second call (retry) returns 200
        mock.onGet('/protected-route').replyOnce(200, { data: 'retry-ok' });

        const response = await apiClient.get('/protected-route');

        // Check if SecureStore was updated
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', 'new-access-token');
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');

        // Check response is the retry response
        expect(response.data.data).toBe('retry-ok');
    });

    it('should enqueue concurrent requests and resolve all with the single refresh response', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('old-access-token');

        mock.onGet('/protected-1').replyOnce(401);
        mock.onGet('/protected-2').replyOnce(401);

        let refreshCallCount = 0;
        mock.onPost('/auth/refresh').reply(() => {
            refreshCallCount++;
            return [200, {
                accessToken: 'new-access',
                refreshToken: 'new-refresh',
            }];
        });

        mock.onGet('/protected-1').replyOnce(200, { id: 1 });
        mock.onGet('/protected-2').replyOnce(200, { id: 2 });

        const [res1, res2] = await Promise.all([
            apiClient.get('/protected-1'),
            apiClient.get('/protected-2')
        ]);

        expect(refreshCallCount).toBe(1); // Single background refresh
        expect(res1.data.id).toBe(1);
        expect(res2.data.id).toBe(2);
    });

    it('should clear SecureStore and trigger logout if refresh fails (e.g. invalid RT)', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('old-token');

        mock.onGet('/protected-route').replyOnce(401);
        mock.onPost('/auth/refresh').reply(401); // Refresh rejected

        await expect(apiClient.get('/protected-route')).rejects.toThrow();

        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('accessToken');
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshToken');
    });
});
