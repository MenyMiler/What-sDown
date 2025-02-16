import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { Network, NetworkDocument } from '../interfaces/network';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { GetByQuery } from '../utils/types';

export class NetworksService {
    private static api = createAxiosInstance(environment.api.networks);

    static getById = async (id: string): Promise<NetworkDocument> => {
        const { data } = await this.api.get(`/${id}`);
        return data;
    };

    static getByQuery = async (query: GetByQuery<Network> = {}): Promise<NetworkDocument[]> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static createOne = async (network: Network): Promise<NetworkDocument> => {
        const { data } = await this.api.post('/', network);
        return data;
    };

    static updateOne = async (id: string, update: Partial<Network>): Promise<NetworkDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<NetworkDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<NetworkDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };
}
