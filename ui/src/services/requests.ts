import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import {
    PopulatedRequest,
    Request,
    RequestDocument,
    RequestStatuses,
    RequestTypes,
    RequestsTableData,
    RequestsTypesCategories,
} from '../interfaces/request';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { ConditionalReturnType, GetByQuery } from '../utils/types';

export class RequestsService {
    private static api = createAxiosInstance(environment.api.requests);

    static async getById<T extends boolean>(id: string, populate: T): Promise<ConditionalReturnType<T, PopulatedRequest, RequestDocument>> {
        const { data } = await this.api.get(`/${id}`, { params: { populate } });
        return data;
    }

    static async getByQuery<T extends boolean>(
        query: GetByQuery<Request, T> = {},
    ): Promise<ConditionalReturnType<T, PopulatedRequest[], RequestDocument[]>> {
        const { data } = await this.api.get('/', { params: query });
        return data;
    }

    static getCount = async (query: Partial<Request>): Promise<number> => {
        const { data } = await this.api.get('/count', { params: query });
        return data;
    };

    // TODO change route in backend
    static getRequestsForApproval = async (baseId?: string): Promise<PopulatedRequest[]> => {
        const { data } = await this.api.get('/for-approval', { params: { baseId } });
        return data;
    };

    static getByStatusesAndTypes = async (
        query: Omit<GetByQuery<Request>, 'status'>,
        statuses: RequestStatuses[],
        types: RequestTypes[],
    ): Promise<RequestDocument[]> => {
        const { data } = await this.api.post('/statuses-and-types', { params: query, statuses, types });
        return data;
    };

    static createOne = async (request: Omit<Request, 'status'>): Promise<RequestDocument> => {
        const { data } = await this.api.post('/', request);

        return data;
    };

    static updateOne = async (id: string, update?: Partial<Request>): Promise<RequestDocument> => {
        const { data } = await this.api.put(`/${id}`, update);
        return data;
    };

    static cancelRequest = async (requestId: string, response: string) => {
        const { data } = await this.api.put(`/cancel/${requestId}`, { response });
        return data;
    };

    static deleteOne = async (id: string): Promise<RequestDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static search = async (agGridRequest: agGridRequest): Promise<agGridResponse<RequestDocument>> => {
        const { data } = await this.api.post('/search', agGridRequest);
        return data;
    };

    static getAllTypeCountsByStatus = async (
        status: string,
        requesterId: string,
        baseId: string,
    ): Promise<{ type: RequestTypes; amount: number }[]> => {
        const { data } = await this.api.get(`/${status}/count`, { params: { requesterId, baseId } });
        return data;
    };

    static getRowsToDisplay = async (
        query: GetByQuery<Request>,
        statuses: RequestStatuses[],
        requestCategory: RequestsTypesCategories,
    ): Promise<RequestsTableData[]> => {
        const { data } = await this.api.post('/requests-management-table', { statuses, requestCategory }, { params: query });
        return data;
    };
}
