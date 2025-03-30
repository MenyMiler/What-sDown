import axios from 'axios';
import { config } from '../../config';
import { System, SystemsDocument } from './interface';

const {
    systems: { uri, baseRoute },
    service,
} = config;
export class SystemsService {
    private static api = axios.create({ baseURL: `${uri}${baseRoute}`, timeout: service.requestTimeout });

    static async getByQuery(query: Partial<System>) {
        const { data } = await SystemsService.api.get<SystemsDocument[]>(`/`, { params: { query } });
        return data;
    }

    static async createOne(system: Partial<System>) {
        const { data } = await SystemsService.api.post<SystemsDocument>(`/`, system);
        return data;
    }

    static async createMany(systems: Partial<System>[]) {
        const { data } = await SystemsService.api.post<SystemsDocument[]>(`/`, systems);
        return data;
    }

    static async updateOne(systemId: string, update: Partial<System>) {
        const { data } = await SystemsService.api.put<SystemsDocument>(`/${systemId}`, update);
        return data;
    }

    static async deleteOne(systemId: string) {
        const { data } = await SystemsService.api.delete<SystemsDocument>(`/${systemId}`);
        return data;
    }
}
