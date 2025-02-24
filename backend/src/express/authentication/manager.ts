import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { UsersService } from '../users/service';

export class AuthenticationManager {
    static async getUserToken(payload: object): Promise<string | null> {
        const genesisId = payload['genesisId'];
        if (!genesisId) return null;
        await UsersService.checkIfUserExistsElseCreate(genesisId);
        
        return jwt.sign({ ...payload }, config.authentication.secret, { expiresIn: config.authentication.expiresIn, algorithm: 'HS256' });
    }
}