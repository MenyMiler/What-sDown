import { isAxiosError } from 'axios';
import { config } from './config';
import { isBranchesServiceAlive } from './mocks/branches';
import { createBranches, getBranches } from './mocks/branches/branches';
import { isCoursesServiceAlive } from './mocks/courses';
import { createCourseTemplates, getCourseTemplates } from './mocks/courses/courseTemplates';
import { createCourses, getCourses } from './mocks/courses/courses';
import { isEventsServiceAlive } from './mocks/events';
import { createEvents, getEvents } from './mocks/events/events';
import { isNetworksServiceAlive } from './mocks/networks';
import { createNetworks, getNetworks } from './mocks/networks/networks';
import { isResourcesServiceAlive } from './mocks/resources';
import { createAreas, getAreas } from './mocks/resources/areas';
import { createBases, getBases } from './mocks/resources/bases';
import { createBuildings, getBuildings } from './mocks/resources/buildings';
import { createFloors, getFloors } from './mocks/resources/floors';
import { createRoomsInCourse, getRoomsInCourses } from './mocks/resources/roomInCourse';
import { createRoomsInEvents, getRoomsInEvents } from './mocks/resources/roomInEvent';
import { createRooms, getRooms } from './mocks/resources/rooms';
import { isSoldiersServiceAlive } from './mocks/soldiers';
import { createSoldiersInEvents, getSoldierInEvent } from './mocks/soldiers/soldierInEvent';
import { createSoldiersInRoomsInCourses, getSoldierInRoomInCourse } from './mocks/soldiers/soldierInRoomInCourse';
import { createSoldiers, getSoldiers } from './mocks/soldiers/soldiers';
import { createSoldiersInRoomsInEvent, getSoldierInRoomInEvent } from './mocks/soldiers/soldiersInRoomInEvent';
import { isUsersServiceAlive } from './mocks/users';
import { createUsers, getUsers } from './mocks/users/users';
import { logger } from './utils/logger';

const areServicesAlive = async () =>
    Promise.all([
        isResourcesServiceAlive(),
        isBranchesServiceAlive(),
        isUsersServiceAlive(),
        isCoursesServiceAlive(),
        isEventsServiceAlive(),
        isNetworksServiceAlive(),
        isSoldiersServiceAlive(),
    ]);

const isDbEmpty = async () =>
    (
        await Promise.all([
            getBases(),
            getAreas(),
            getBranches(),
            getUsers(),
            getBuildings(),
            getFloors(),
            getRooms(),
            getSoldiers(),
            getNetworks(),
            getCourseTemplates(),
            getCourses(),
            getEvents(),
            getRoomsInCourses(),
            getSoldierInRoomInCourse(),
            getSoldierInEvent(),
            getSoldierInRoomInEvent(),
            getRoomsInEvents(),
        ])
    ).some((arr) => arr.length);

const main = async () => {
    logger.info(`Mock started`);

    await areServicesAlive();

    logger.info('All services alive!');

    if (await isDbEmpty()) {
        logger.warn('DB not empty');
    } else {
        logger.info('DB is empty, creating data');

        logger.info('Creating networks');

        const createdNetworks = await createNetworks();

        logger.info('Creating branches');

        const createdBranches = await createBranches();

        logger.info('Creating bases');

        const createdBases = await createBases(createdBranches);

        logger.info('Creating users');

        await createUsers(createdBases);

        logger.info('Creating areas');

        const createdAreas = await createAreas(createdBases);

        logger.info('Creating buildings');

        const createdBuildings = await createBuildings(createdAreas);

        logger.info('Creating floors');

        await createFloors(createdBuildings);

        logger.info('Creating rooms');

        await createRooms(createdNetworks);

        logger.info('Creating soldiers');

        const createdSoldiers = await createSoldiers();

        logger.info('Creating course templates');

        const createdCourseTemplates = await createCourseTemplates(createdBases, createdNetworks);

        logger.info('Creating courses');

        const createdCourses = await createCourses(createdCourseTemplates, createdNetworks);

        logger.info('Creating events');

        const createdEvents = await createEvents(createdBases, createdCourses);

        logger.info('Creating rooms in courses');

        const createdRoomsInCourses = await createRoomsInCourse(createdCourses);

        logger.info('Creating soldiers in events');

        const createdSoldiersInEvents = await createSoldiersInEvents(createdSoldiers, createdEvents);

        logger.info('Creating soldiers in rooms in courses');

        await createSoldiersInRoomsInCourses(createdSoldiers, createdRoomsInCourses, createdSoldiersInEvents);

        logger.info('Creating rooms in events');

        const createdRoomsInEvents = await createRoomsInEvents(createdEvents);

        logger.info('Creating soldiers in rooms in events');

        await createSoldiersInRoomsInEvent(createdSoldiers, createdRoomsInEvents);

        logger.info('Finished');
    }
};

logger.info('Mock waiting...');
setTimeout(
    () =>
        main().catch((err: any) => {
            if (isAxiosError(err)) logger.error(err.response?.data);
            else logger.error(err);
        }),
    config.mockDelay,
);
