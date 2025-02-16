import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { Branch, BranchDocument } from '../interfaces/branch';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { GetByQuery } from '../utils/types';

export class BranchesService {
    private static api = createAxiosInstance(environment.api.branches);

    static getById = async (id: string): Promise<BranchDocument> => {
        const { data } = await this.api.get(`/${id}`);
        return data;
    };

    static getByQuery = async (query: GetByQuery<Branch> = {}): Promise<BranchDocument[]> => {
        const { data } = await this.api.get('/', { params: query });
        return data;
    };

    static createOne = async (branch: Branch): Promise<BranchDocument> => {
        const { data } = await this.api.post('/', branch);
        return data;
    };

    static updateOne = async (id: string, update: Partial<Branch>): Promise<BranchDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static deleteOne = async (id: string): Promise<BranchDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<BranchDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };
}
