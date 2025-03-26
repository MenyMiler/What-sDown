import { config } from '../../config';
import { isAlive, wrapIsAlive } from '../../utils/isAlive';

const { uri } = config.soldiers;

export const isSoldiersServiceAlive = () => wrapIsAlive(() => isAlive(uri), 'Soldiers service is not alive');
