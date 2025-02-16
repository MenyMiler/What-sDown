import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { Floor, FloorDocument } from '../interfaces/floor';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { GetByQuery } from '../utils/types';

export class FloorsService {
    private static api = createAxiosInstance(environment.api.floors);

    static getById = async (id: string): Promise<FloorDocument> => {
        const { data } = await this.api.get(`/${id}`);
        return data;
    };

    static getByQuery = async (query: GetByQuery<Floor> = {}): Promise<FloorDocument[]> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static createOne = async (floor: Floor): Promise<FloorDocument> => {
        const { data } = await this.api.post('/', floor);
        return data;
    };

    static createBulk = async (floors: Floor[]): Promise<FloorDocument[]> => {
        const { data } = await this.api.post('/bulk', floors);
        return data;
    };

    static updateOne = async (id: string, update: Partial<Floor>): Promise<FloorDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<FloorDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<FloorDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };
}
