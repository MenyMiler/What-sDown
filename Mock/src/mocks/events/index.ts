import { config } from '../../config';
import { isAlive, wrapIsAlive } from '../../utils/isAlive';

const { uri } = config.events;

export const isEventsServiceAlive = () => wrapIsAlive(() => isAlive(uri), 'Events service is not alive');
