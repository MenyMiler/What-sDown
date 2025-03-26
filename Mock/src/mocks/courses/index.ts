import { config } from '../../config';
import { isAlive, wrapIsAlive } from '../../utils/isAlive';

const { uri } = config.courses;

export const isCoursesServiceAlive = () => wrapIsAlive(() => isAlive(uri), 'Courses service is not alive');
