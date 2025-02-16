import { createAxiosInstance } from '../axios';
import { environment } from '../globals';
import { PopulatedUser, User, UserDocument, UserPermissions } from '../interfaces/user';
import type { agGridRequest, agGridResponse } from '../utils/agGrid';
import { ConditionalReturnType, GetByQuery } from '../utils/types';

export class UsersService {
    private static api = createAxiosInstance(environment.api.users);

    static getById = async <T extends boolean>(id: string, populate: T): Promise<ConditionalReturnType<T, PopulatedUser, UserDocument>> => {
        const { data } = await this.api.get(`/${id}`, { params: { populate } });
        return data;
    };

    static getByQuery = async <T extends boolean>(
        query: GetByQuery<User>,
        populate: T,
    ): Promise<ConditionalReturnType<T, PopulatedUser[], UserDocument[]>> => {
        const { data } = await this.api.get('/', { params: { ...query, populate } });
        return data;
    };

    static getUserPermissions = async (genesisId: string): Promise<UserPermissions> => {
        const { data } = await this.api.get(`/genesisId/${genesisId}`);

        return data;
    };

    static search = async <T extends boolean>(
        agGridRequest: agGridRequest,
        populate: T,
    ): Promise<ConditionalReturnType<T, agGridResponse<PopulatedUser>, agGridResponse<UserDocument>>> => {
        const { data } = await this.api.post('/search', agGridRequest, { params: { populate } });
        return data;
    };

    static createOne = async <T extends boolean>(user: User, populate: T): Promise<ConditionalReturnType<T, PopulatedUser, UserDocument>> => {
        const { data } = await this.api.post('/', user, { params: { populate } });
        return data;
    };

    static updateOne = async <T extends boolean>(
        id: string,
        update: Partial<User>,
        populate: T,
    ): Promise<ConditionalReturnType<T, PopulatedUser, UserDocument>> => {
        const { data } = await this.api.put(`/${id}`, update, { params: { populate } });
        return data;
    };

    static deleteOne = async (id: string): Promise<UserDocument> => {
        const { data } = await this.api.delete(`/${id}`);
        return data;
    };

    static deleteOneByGenesisIdAndBaseId = async (genesisId: string, baseId: string): Promise<UserDocument> => {
        const { data } = await this.api.delete(`/genesisId/${genesisId}/baseId/${baseId}`);
        return data;
    };
}
