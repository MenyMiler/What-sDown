
import axios from 'axios';
import { config } from '../../config';
import { UserDocument } from './interface';
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

    static async getByGenesisId(genesisId: string) {
        
        const { data } = await UsersService.api.get<UserDocument>(`/genesisId/${genesisId}`);
        return data;
    }

    static async checkIfUserExistsElseCreate(genesisId: string) {
        console.log("checkIfUserExistsElseCreate");
        let user;
        try {
            user = await UsersService.getByGenesisId(genesisId);
        } catch (error: any) {
            return await UsersService.createOne({ genesisId });
        }
        if (!user) return await UsersService.createOne({ genesisId });
        return user;
    }

    static async createOne({ genesisId }) {
        
        const { data } = await UsersService.api.post<UserDocument>(`/`, { genesisId, status: true });

        return data;
    }
}