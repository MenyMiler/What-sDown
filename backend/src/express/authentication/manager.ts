import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { UsersService } from '../users/service';

export class AuthenticationManager {
    static async getUserToken(payload: object): Promise<string | null> {
        console.log("getUserToken", {payload});
        const genesisId = payload['genesisId'];
        if (!genesisId) return null;
        //check if i have user with this genesisId if exist continue else add user
        const user = await UsersService.checkIfUserExistsElseCreate(genesisId);
        console.log("user", user);
        
        return jwt.sign({ ...payload }, config.authentication.secret, { expiresIn: config.authentication.expiresIn, algorithm: 'HS256' });
    }
}