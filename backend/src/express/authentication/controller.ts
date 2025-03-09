import { Request, Response } from 'express';
import { config } from '../../config';
import { ShragaUser } from '../../utils/express/passport';
import { AuthenticationManager } from './manager';

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
        return res.redirect(RelayState || '');


    }
}
