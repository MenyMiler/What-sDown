
import axios from 'axios';
import { config } from '../../config';
import { User, UserDocument } from './interface';
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

    static async updateOneByGenesisId(genesisId: string, update: Partial<User>) {
        const { data } = await UsersService.api.put<UserDocument>(`/genesisId/${genesisId}`, update);
        return data;
    }

    static async checkIfUserExistsElseCreate(genesisId: string) {
        let user;
        try {
            user = await UsersService.getByGenesisId(genesisId);
        } catch (error: any) {
            return await UsersService.createOne( genesisId );
        }
        if (!user) return await UsersService.createOne( genesisId );
        return user;
    }

    static async createOne( genesisId: string)  {
        let type;
        genesisId == "5e5688324203fc40043591aa" ? (type = "ADMIN") : (type = "USER");
        const { data } = await UsersService.api.post<UserDocument>(`/`, { genesisId, type });

        return data;
    }
}
