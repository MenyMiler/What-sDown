import { config } from './config';
import { Server } from './express/server';
import { logger } from './utils/logger';

const { service } = config;

const main = async () => {
    const server = new Server(service.port);

    await server.start();

    logger.info(`Backend started on port: ${service.port}`);
};

main().catch(logger.error);
