import { Router } from 'express';
import { systemsRouter } from './systems/router.js';

export const appRouter = Router();

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('/api/systems', systemsRouter);

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
