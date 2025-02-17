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
        console.log("createTokenAndRedirect");
        

        // console.log("req.user.RelayState", req.user?.RelayState);
        // console.log("req.query", req.query);
        const { exp, iat, jti, RelayState, ...shragaUser } = req.user as ShragaUser;
        // console.log({RelayState});

        const result = await AuthenticationManager.getUserToken(shragaUser);


        if (!result) return res.redirect(`${systemUnavailableURL}`);


        // http://localhost:5000/api/auth/login?RelayState=/api/users

        
        res.cookie(token, result);
        //get the user from userService and add shing the token to the cookie
        const user = await UsersService.getByGenesisId(shragaUser.genesisId);
        if (user) {
            console.log("2= ", {user});
            const systemUser = await jwt.sign({ ...user }, config.authentication.secret, { expiresIn: config.authentication.expiresIn, algorithm: 'HS256' }); 
            res.cookie("systemUser", systemUser);
        }
        return res.redirect(RelayState || '');


    }
}
