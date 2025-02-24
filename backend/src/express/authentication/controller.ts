import { Request, Response } from 'express';
import { config } from '../../config';
import { ShragaUser } from '../../utils/express/passport';
import { AuthenticationManager } from './manager';
import { UsersService } from '../users/service';
import jwt from 'jsonwebtoken';

const {
    service: { systemUnavailableURL },
    authentication: { token },
} = config;

export class AuthenticationController {
    static async createTokenAndRedirect(req: Request, res: Response) {
        

        const { exp, iat, jti, RelayState, ...shragaUser } = req.user as ShragaUser;

        const result = await AuthenticationManager.getUserToken(shragaUser);


        if (!result) return res.redirect(`${systemUnavailableURL}`);



        
        res.cookie(token, result);
        const user = await UsersService.getByGenesisId(shragaUser.genesisId);
        if (user) {
            const systemUser = await jwt.sign({ ...user }, config.authentication.secret, { expiresIn: config.authentication.expiresIn, algorithm: 'HS256' }); 
            res.cookie("systemUser", systemUser);
        }
        return res.redirect(RelayState || '');


    }
}
