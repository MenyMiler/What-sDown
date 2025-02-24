import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { config } from '../../config';
import { validateRequest, wrapController } from '../../utils/express/wrappers';
import { createOneRequestSchema, deleteOneRequestSchema, getByQueryRequestSchema, updateOneRequestSchema } from './validations';
import { FeaturesController } from './controller';


const {
    features: { uri },
    service,
} = config;

export const featuresRouter = Router();



featuresRouter.get('/', createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }), 
validateRequest(getByQueryRequestSchema), wrapController(FeaturesController.getByAll));

featuresRouter.post('/', validateRequest(createOneRequestSchema), wrapController(FeaturesController.createOne));

featuresRouter.put('/:id', validateRequest(updateOneRequestSchema), wrapController(FeaturesController.updateOne));

featuresRouter.delete('/:id', validateRequest(deleteOneRequestSchema), wrapController(FeaturesController.deleteOne));




