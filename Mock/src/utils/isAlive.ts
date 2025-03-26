import { config } from '../config';
import { axios } from './axios';
import { logger } from './logger';

export const isAlive = async (uri: string) => {
    const { data } = await axios.get(uri + config.isAliveRoute);
    return data;
};

export const wrapIsAlive = async (isAliveFunction: () => Promise<any>, errorMessage: string) => {
    try {
        await isAliveFunction();
    } catch (error) {
        logger.error(errorMessage);
        throw error;
    }
};
