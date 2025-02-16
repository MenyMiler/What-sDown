import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { Building, BuildingDocument } from '../interfaces/building';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { GetByQuery } from '../utils/types';

export class BuildingsService {
    private static api = createAxiosInstance(environment.api.buildings);

    static getById = async (id: string): Promise<BuildingDocument> => {
        const { data } = await this.api.get(`/${id}`);
        return data;
    };

    static getByQuery = async (query: GetByQuery<Building> = {}): Promise<BuildingDocument[]> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static createOne = async (building: Building): Promise<BuildingDocument> => {
        const { data } = await this.api.post('/', building);
        return data;
    };

    static createBulk = async (buildings: Building[]): Promise<BuildingDocument[]> => {
        const { data } = await this.api.post('/bulk', buildings);
        return data;
    };

    static updateOne = async (id: string, update: Partial<Building>): Promise<BuildingDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<BuildingDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<BuildingDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };
}
