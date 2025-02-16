import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { LogDocument, Log } from '../interfaces/activityLogs';
import { ConditionalReturnType, GetByQuery } from '../utils/types';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';

export class ActivityLogService {
    private static api = createAxiosInstance(environment.api.activityLogs);

    static getById = async (id: string): Promise<LogDocument> => {
        const { data } = await this.api.get(`/${id}`);

        return data;
    };

    static getByQuery = async <T extends boolean>(
        query: GetByQuery<Log, T> = {},
    ): Promise<ConditionalReturnType<T, LogDocument[], LogDocument[]>> => {
        const { data } = await this.api.get('/', { params: query });

        return data;
    };

    static createOne = async (base: Omit<Log, 'createdAt' | 'updatedAt'>): Promise<LogDocument> => {
        const { data } = await this.api.post('/', base);

        return data;
    };

    static createBulk = async (bases: Log[]): Promise<LogDocument[]> => {
        const { data } = await this.api.post('/bulk', bases);

        return data;
    };

    static updateOne = async (id: string, update: Partial<Log>): Promise<LogDocument> => {
        const { data } = await this.api.put(`/${id}`, update);

        return data;
    };

    static deleteOne = async (id: string): Promise<LogDocument> => {
        const { data } = await this.api.delete(`/${id}`);

        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<LogDocument>> => {
        agGridRequest.sortModel.push({ sort: 'desc', colId: 'createdAt' });
        const { data } = await this.api.post('/search', agGridRequest);

        return data;
    };
}
