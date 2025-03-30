import { Router } from 'express';
import { validateRequest, wrapController } from '../../utils/express/wrappers.js';
import { SystemsController } from './controller.js';
import {
    createManyRequestSchema,
    createOneRequestSchema,
    deleteOneRequestSchema,
    getByIdRequestSchema,
    getByQueryRequestSchema,
    getCountRequestSchema,
    updateOneRequestSchema,
} from './validations.js';

export const systemsRouter = Router();

systemsRouter.get('/', validateRequest(getByQueryRequestSchema), wrapController(SystemsController.getByQuery));

systemsRouter.get('/count', validateRequest(getCountRequestSchema), wrapController(SystemsController.getCount));

systemsRouter.get('/:id', validateRequest(getByIdRequestSchema), wrapController(SystemsController.getById));

systemsRouter.post('/', validateRequest(createOneRequestSchema), wrapController(SystemsController.createOne));

systemsRouter.post('/', validateRequest(createManyRequestSchema), wrapController(SystemsController.createMany));

systemsRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(SystemsController.updateOne));

systemsRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(SystemsController.deleteOne));
