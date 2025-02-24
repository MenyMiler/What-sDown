import { Router } from 'express';
import passport from 'passport';
import { wrapController } from '../../utils/express/wrappers';
import { AuthenticationController } from './controller';

export const authenticationRouter = Router();



authenticationRouter.get('/login', passport.authenticate('shraga', { failureRedirect: '/unauthorized' }));



authenticationRouter.post(
    '/callback',
    passport.authenticate('shraga', { failureRedirect: '/unauthorized' }),
    wrapController(AuthenticationController.createTokenAndRedirect),
);

    