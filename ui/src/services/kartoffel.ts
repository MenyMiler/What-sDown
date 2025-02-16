import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { KartoffelUser } from '../interfaces/kartoffel';

export class KartoffelService {
    private static api = createAxiosInstance(environment.api.kartoffel);

    static searchUserByName = async (search: string): Promise<KartoffelUser[]> => {
        if (search.length < 2) return [];

        const { data } = await this.api.get('/search', { params: { search } });
        return data;
    };

    static getUserById = async (userId: string): Promise<KartoffelUser> => {
        const { data } = await this.api.get(`/${userId}`);
        return data;
    };

    static getByIds = async (ids: string[]): Promise<KartoffelUser[]> => {
        if (!ids.length) return [];

        const { data } = await this.api.get('/', { params: { ids } });
        return data;
    };
}
