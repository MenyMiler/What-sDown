import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers.js';
import { UsersController } from './controller.js';
import {
    createOneRequestSchema,
    deleteOneRequestSchema,
    getNotAdminsRequestSchema,
    getByGenesisIdRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    updateOneRequestSchema,
    updateOneRequestSchemaByGenesisId,
} from './validations.js';

export const usersRouter = Router();

usersRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(UsersController.getByQuery));

usersRouter.get('/admins', wrapController(UsersController.getAllAdmins));


usersRouter.get('/notAdmins', validateRequest(getNotAdminsRequestSchema), wrapController(UsersController.getAllNotAdmins));

//to add a new user admin if he not admin or not exist
usersRouter.post('/addAdmin/:genesisId', wrapController(UsersController.addAdmin));

usersRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(UsersController.getById));

usersRouter.get('/genesisId/:genesisId', validateRequest(getByGenesisIdRequestSchema), wrapController(UsersController.getByGenesisId));

usersRouter.post('/', validateRequest(createOneRequestSchema), wrapController(UsersController.createOne));

usersRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(UsersController.updateOne));

usersRouter.put('/genesisId/:genesisId', validateRequest(updateOneRequestSchemaByGenesisId), wrapController(UsersController.updateOneByGenesisId));

usersRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(UsersController.deleteOne));
