import { config } from '../../config';
import { isAlive, wrapIsAlive } from '../../utils/isAlive';

const { uri } = config.users;

export const isUsersServiceAlive = () => wrapIsAlive(() => isAlive(uri), 'Users service is not alive');
