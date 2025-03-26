import { config } from '../../config';
import { isAlive, wrapIsAlive } from '../../utils/isAlive';

const { uri } = config.systems;

export const isSystemsServiceAlive = () => wrapIsAlive(() => isAlive(uri), 'Systems service is not alive');
