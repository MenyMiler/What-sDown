import { config } from '../../config';
import { isAlive, wrapIsAlive } from '../../utils/isAlive';

const { uri } = config.branches;

export const isBranchesServiceAlive = () => wrapIsAlive(() => isAlive(uri), 'Branches service is not alive');
