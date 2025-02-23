import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers.js';
import { UsersController } from './controller.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    getByGenesisIdRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getCountRequestSchema,
    updateOneRequestSchema,
} from './validations.js';

export const usersRouter = Router();

usersRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(UsersController.getByQuery));

usersRouter.get('/count', validateRequest(getCountRequestSchema), wrapController(UsersController.getCount));

usersRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(UsersController.getById));

usersRouter.get('/genesisId/:genesisId', validateRequest(getByGenesisIdRequestSchema), wrapController(UsersController.getByGenesisId));

usersRouter.post('/', validateRequest(createOneRequestSchema), wrapController(UsersController.createOne));

usersRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(UsersController.updateOne));

usersRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(UsersController.deleteOne));
