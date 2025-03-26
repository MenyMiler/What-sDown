import * as env from 'env-var';
import './dotenv';

export const config = {
    mockDelay: env.get('MOCK_DELAY').default(10000).asInt(),
    isAliveRoute: env.get('IS_ALIVE_ROUTE').default('/isAlive').asString(),
    getManyParams: { step: 0, limit: 1 },
    courses: {
        uri: env.get('COURSES_SERVICE_URI').default('http://courses-service:8000').asString(),
        coursesRoute: env.get('COURSES_BASE_ROUTE').default('/api/courses').asString(),
        courseTemplatesRoute: env.get('COURSE_TEMPLATES_BASE_ROUTE').default('/api/course-templates').asString(),
        numberOfCourses: env.get('NUMBER_OF_COURSES').default(20).asInt(),
    },
    resources: {
        uri: env.get('RESOURCES_SERVICE_URI').default('http://resources-service:8000').asString(),
        basesRoute: env.get('BASES_BASE_ROUTE').default('/api/bases').asString(),
        areasRoute: env.get('AREAS_BASE_ROUTE').default('/api/areas').asString(),
        buildingsRoute: env.get('BUILDINGS_BASE_ROUTE').default('/api/buildings').asString(),
        floorsRoute: env.get('FLOORS_BASE_ROUTE').default('/api/floors').asString(),
        roomsRoute: env.get('ROOMS_BASE_ROUTE').default('/api/rooms').asString(),
        roomInCourseRoute: env.get('ROOM_IN_COURSE_BASE_ROUTE').default('/api/room-in-course').asString(),
        networkInRoomRoute: env.get('NETWORK_IN_ROOM_BASE_ROUTE').default('/api/network-in-room').asString(),
        branchInBaseRoute: env.get('BRANCH_IN_BASE_BASE_ROUTE').default('/api/branch-in-base').asString(),
        numberOfAreasInEachBase: env.get('NUMBER_OF_AREAS_IN_EACH_BASE').default(2).asInt(),
        numberOfBuildings: env.get('NUMBER_OF_BUILDINGS').default(10).asInt(),
        numberOfFloors: env.get('NUMBER_OF_FLOORS').default(3).asInt(),
        numberOfRooms: env.get('NUMBER_OF_ROOMS').default(2).asInt(),
        bedroomSizes: [5, 8],
        maxComputersInClassOrOffice: env.get('MAX_COMPUTERS_IN_CLASS_OR_OFFICE').default(8).asInt(),
        roomInEventsRoute: env.get('ROOM_IN_EVENTS_BASE_ROUTE').default('/api/room-in-events').asString(),
    },
    networks: {
        uri: env.get('NETWORKS_SERVICE_URI').default('http://networks-service:8000').asString(),
        baseRoute: env.get('NETWORKS_BASE_ROUTE').default('/api/networks').asString(),
    },
    branches: {
        uri: env.get('BRANCHES_SERVICE_URI').default('http://branches-service:8000').asString(),
        baseRoute: env.get('BRANCHES_BASE_ROUTE').default('/api/branches').asString(),
    },
    events: {
        uri: env.get('EVENTS_SERVICE_URI').default('http://events-service:8000').asString(),
        baseRoute: env.get('EVENTS_BASE_ROUTE').default('/api/events').asString(),
        numberOfEvents: env.get('NUMBER_OF_EVENTS').default(5).asInt(),
        numberOfEventsRelatedToCourse: env.get('NUMBER_OF_EVENTS_RELATED_TO_COURSE').default(5).asInt(),
        beforeDate: env.get('BEFORE_DATE').default(14).required().asIntPositive(),
        afterDate: env.get('AFTER_DATE').default(7).required().asIntPositive(),
        roomInEventsRoute: env.get('ROOM_IN_EVENTS_BASE_ROUTE').default('/api/room-in-event').asString(),
    },
    soldiers: {
        uri: env.get('SOLDIERS_SERVICE_URI').default('http://soldiers-service:8000').asString(),
        baseRoute: env.get('SOLDIERS_BASE_ROUTE').default('/api/soldiers').asString(),
        soldierInRoomInCourseRoute: env.get('SOLDIER_IN_ROOM_IN_COURSE_BASE_ROUTE').default('/api/soldier-in-room-in-courses').asString(),
        soldierInRoomInEventRoute: env.get('SOLDIER_IN_ROOM_IN_EVENT_BASE_ROUTE').default('/api/soldier-in-room-in-event').asString(),
        soldierInEventRoute: env.get('SOLDIER_IN_EVENT_BASE_ROUTE').default('/api/soldier-in-event').asString(),
        numberOfStaff: env.get('NUMBER_OF_STAFF').default(10).asInt(),
        numberOfStudents: env.get('NUMBER_OF_STUDENTS').default(100).asInt(),
    },
    users: {
        uri: env.get('USERS_SERVICE_URI').default('http://users-service:8000').asString(),
        baseRoute: env.get('USERS_BASE_ROUTE').default('/api/users').asString(),
        genesisIdsForInternalNetwork: env.get('GENESIS_IDS_FOR_INTERNAL_NETWORK').default('').asArray(),
    },
};
