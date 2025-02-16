import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { Area, AreaDocument, PopulatedArea } from '../interfaces/area';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { ConditionalReturnType, GetByQuery } from '../utils/types';

export class AreasService {
    private static api = createAxiosInstance(environment.api.areas);

    static getById = async <T extends boolean>(id: string, populate: T): Promise<ConditionalReturnType<T, PopulatedArea, AreaDocument>> => {
        const { data } = await this.api.get(`/${id}`, { params: { populate } });
        return data;
    };

    static getByQuery = async <T extends boolean>(
        query: GetByQuery<Area, T> = {},
    ): Promise<ConditionalReturnType<T, PopulatedArea[], AreaDocument[]>> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static createOne = async (area: Area): Promise<AreaDocument> => {
        const { data } = await this.api.post('/', area);
        return data;
    };

    static createBulk = async (areas: Area[]): Promise<AreaDocument[]> => {
        const { data } = await this.api.post('/bulk', areas);
        return data;
    };

    static updateOne = async (id: string, update: Partial<Area>): Promise<AreaDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<AreaDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<AreaDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };
}
