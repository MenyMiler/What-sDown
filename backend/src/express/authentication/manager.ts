import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { UsersService } from '../users/service';

export class AuthenticationManager {
    static async getUserToken(payload: object): Promise<string | null> {
        const genesisId = payload['genesisId'];
        if (!genesisId) return null;
        const user = await UsersService.checkIfUserExistsElseCreate(genesisId);
        console.log(user.type);
        
        return jwt.sign({ ...payload, type: user.type , _id: user._id }, config.authentication.secret, { expiresIn: config.authentication.expiresIn, algorithm: 'HS256' });
    }
}