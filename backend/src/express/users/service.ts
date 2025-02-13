import axios from 'axios';
import { config } from '../../config';
import { AgGridRequest, AgGridSearchResult } from '../../utils/agGrid/interface';
// import { compareJson } from '../../utils/express/diffrentBetweenJson';
import { GetByQuery } from '../../utils/types';
import createUserDTO, { User, UserDocument } from './interface';

const {
    users: { uri, baseRoute },
    service,
} = config;

export class UsersService {
    private static api = axios.create({ baseURL: `${uri}${baseRoute}`, timeout: service.requestTimeout, params: { expanded: true } });

    static async getById(id: string) {
        const { data } = await UsersService.api.get<UserDocument>(`/${id}`);

        return data;
    }

    static async getByIds(ids: string[]) {
        const { data } = await UsersService.api.post<UserDocument[]>('/ids', { ids });

        return data;
    }

    static async getUserByGenesisId(genesisId: string) {
        const { data } = await UsersService.api.get<{genesisId: string }>(`/genesisId/${genesisId}`);

        return data;
    }


    static async getByQuery(query: GetByQuery<User>) {
        const { data } = await UsersService.api.get<UserDocument[]>('/', { params: query });

        return data;
    }

    static async search(agGridRequest: AgGridRequest) {
        const { data } = await UsersService.api.post<AgGridSearchResult<UserDocument>>('/search', agGridRequest);
        return data;
    }

    static async createOne(user: createUserDTO) {
        const { data } = await UsersService.api.post('/', user);
        return data;
    }

    static async updateOne(id: string, update: Partial<User>, differences) {
        await UsersService.api.put(`/${id}`, update);
        return differences;
    }

    // static async updateByGenesisIdAnd_id(genesisId: string, query: GetByQuery<Omit<User, 'genesisId'>>) {
    //     const beforeChange = await UsersService.getUserByGenesisId(id);
    //     const opposeQuery = { type: query.type, baseId: query._id };

    //     const differences = compareJson(beforeChange.permissionByBase[0], opposeQuery);

    //     await UsersService.api.put(`genesisId/${id}`, query);
    //     return differences;
    // }

    static async deleteOne(user: UserDocument) {
        const { data } = await UsersService.api.delete(`/${user._id}`);
        return data;
    }

    static async deleteByGenesisId(genesisId: string) {
        const deletedUser = await UsersService.getByQuery({ genesisId });
        await UsersService.api.delete(`genesisId/${genesisId}`);
        return deletedUser;
    }
}
