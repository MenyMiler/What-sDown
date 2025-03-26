import { config } from '../../config';
import { isAlive, wrapIsAlive } from '../../utils/isAlive';

const { uri } = config.networks;

export const isNetworksServiceAlive = () => wrapIsAlive(() => isAlive(uri), 'Networks service is not alive');
