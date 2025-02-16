import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { config } from '../../config';
// import { validateRequest, wrapController } from '../../utils/express/wrappers';
// import { UsersController } from './controller';
// import {
//     getByIdRequestSchema,
//     getByQueryRequestSchema,
//     // searchRequestSchema,
//     // updateOneRequestSchema,
//     // deleteOneRequestSchema,
//     // deleteUserByGenesisIdRequestSchema,
// } from './validations';

const {
    users: { uri },
    service,
} = config;

export const usersRouter = Router();





usersRouter.all('*', createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }));
