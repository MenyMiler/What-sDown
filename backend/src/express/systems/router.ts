import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { config } from '../../config';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { createOneRequestSchema, deleteOneRequestSchema, getByQueryRequestSchema, updateOneRequestSchema } from './validations';
import { SystemsController } from './controller';

const {
    systems: { uri },
    service,
} = config;

export const systemsRouter = Router();

systemsRouter.get(
    '/',
    createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }),
    validateRequest(getByQueryRequestSchema),
    wrapController(SystemsController.getByAll),
);

systemsRouter.post('/', validateRequest(createOneRequestSchema), wrapController(SystemsController.createOne));

systemsRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(SystemsController.updateOne));

systemsRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(SystemsController.deleteOne));
