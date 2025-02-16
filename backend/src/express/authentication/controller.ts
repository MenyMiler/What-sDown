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
        console.log("createTokenAndRedirect");
        

        console.log("req.user.RelayState", req.user?.RelayState);
        console.log("req.query", req.query);
        const { exp, iat, jti, RelayState, ...shragaUser } = req.user as ShragaUser;
        console.log({RelayState});

        const result = await AuthenticationManager.getUserToken(shragaUser);


        if (!result) return res.redirect(`${systemUnavailableURL}`);


        // http://localhost:5000/api/auth/login?RelayState=/api/users

        res.cookie(token, result);
        return res.redirect(RelayState || '');


    }
}
