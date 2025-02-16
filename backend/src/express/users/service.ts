
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
}