import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { config } from '../../config';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { UsersController } from './controller';
import {
    getByIdRequestSchema,
    getByQueryRequestSchema,
    // searchRequestSchema,
    // updateOneRequestSchema,
    // deleteOneRequestSchema,
    // deleteUserByGenesisIdRequestSchema,
} from './validations';

const {
    users: { uri },
    service,
} = config;

export const usersRouter = Router();

usersRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(UsersController.getByQuery));

usersRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(UsersController.getById));

// usersRouter.post('/search', validateRequest(searchRequestSchema), wrapController(UsersController.search));


// usersRouter.put(
//     '/:id',
//     validateRequest(updateOneRequestSchema),
// );

// usersRouter.delete(
//     '/:id',
//     validateRequest(deleteOneRequestSchema),
// );

// usersRouter.delete(
//     '/genesisId/:id/baseId/:baseId',
//     validateRequest(deleteUserByGenesisIdRequestSchema),
// );

usersRouter.all('*', createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }));
