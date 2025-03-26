import { config } from '../../config';
import { isAlive, wrapIsAlive } from '../../utils/isAlive';

const { uri } = config.resources;

export const isResourcesServiceAlive = () => wrapIsAlive(() => isAlive(uri), 'Resources service is not alive');
