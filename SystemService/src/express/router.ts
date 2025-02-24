import { Router } from 'express';
import { featuresRouter } from './features/router.js';
import { seed } from '../utils/seed.js';

export const appRouter = Router();


appRouter.use('/', async (_req, _res, next) => {
    console.log("this is a test");
    await seed();
    next();
})

appRouter.use(['/isAlive', '/isalive', '/health'], (_req, res) => {
    res.status(200).send('alive');
});


appRouter.use('/api/features', featuresRouter);




appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});
