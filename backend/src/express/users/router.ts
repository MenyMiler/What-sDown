import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { config } from '../../config';


const {
    users: { uri },
    service,
} = config;

export const usersRouter = Router();




usersRouter.all('*', createProxyMiddleware({ target: uri, onProxyReq: fixRequestBody, proxyTimeout: service.requestTimeout }));

