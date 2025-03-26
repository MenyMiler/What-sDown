import { isAxiosError } from 'axios';
import { config } from './config';
import { isUsersServiceAlive } from './mocks/users';
import { createUsers, getUsers } from './mocks/users/users';
import { logger } from './utils/logger';
import { createSystems, getSystems } from './mocks/systems/systems';
import { isSystemsServiceAlive } from './mocks/systems';

const areServicesAlive = async () =>
    Promise.all([
        isUsersServiceAlive(),
        isSystemsServiceAlive(),
    ]);

const isDbEmpty = async () =>
    (
        await Promise.all([
            getUsers(),
            getSystems(),
        ])
    ).some((arr) => arr.length);

const main = async () => {
    logger.info(`Mock started`);

    await areServicesAlive();

    logger.info('All services alive!');

    if (await isDbEmpty()) {
        logger.warn('DB not empty');
    } else {
        logger.info('DB is empty, creating data');

        logger.info('Creating users');

        await createUsers();

        logger.info('Creating systems');

        await createSystems();

        logger.info('Finished');
    }
};

logger.info('Mock waiting...');
setTimeout(
    () =>
        main().catch((err: any) => {
            if (isAxiosError(err)) logger.error(err.response?.data);
            else logger.error(err);
        }),
    config.mockDelay,
);
