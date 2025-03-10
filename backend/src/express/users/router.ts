import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { config } from '../../config';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { UsersController } from './controller';
import { updateOneRequestSchemaByGenesisId } from './validations';


const {
    users: { uri },
    service,
} = config;

export const usersRouter = Router();

usersRouter.put('/genesisId/:genesisId', validateRequest(updateOneRequestSchemaByGenesisId), wrapController(UsersController.updateOneByGenesisId));


usersRouter.all('*', createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }));

