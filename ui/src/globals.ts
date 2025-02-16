import { ActivityTypes } from './interfaces/activityLogs';
import { RoomTypes } from './interfaces/room';
import { Types as UserTypes } from './interfaces/user';

export enum Months {
    January,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
}

export const environment = {
    api: {
        login: '/api/auth/login',
        kartoffel: '/kartoffel',
        bases: '/bases',
        areas: '/areas',
        buildings: '/buildings',
        floors: '/floors',
        rooms: '/rooms',
        courseTemplates: '/course-templates',
        courses: '/courses',
        users: '/users',
        soldiers: '/soldiers',
        soldierInRoomInCourses: '/soldier-in-room-in-courses',
        roomInCourse: '/room-in-course',
        roomInEvent: '/room-in-event',
        requests: '/requests',
        feedbacks: '/feedbacks',
        events: '/events',
        feedbacksArchive: '/feedbacks-archive',
        networks: '/networks',
        branches: '/branches',
        activityLogs: '/logs',
    },

    concurrency: 10,

    pagination: {
        limit: 20,
    },
    accessTokenName: 'vision-access-token',

    permissions: {
        all: [UserTypes.SUPERADMIN, UserTypes.RESOURCE_MANAGER, UserTypes.PLANNING, UserTypes.AUTHORIZED, UserTypes.SERGEANT],
        allWithoutPlanning: [UserTypes.SUPERADMIN, UserTypes.RESOURCE_MANAGER, UserTypes.AUTHORIZED, UserTypes.SERGEANT, UserTypes.VISITOR],
        allWithoutSergeant: [UserTypes.SUPERADMIN, UserTypes.RESOURCE_MANAGER, UserTypes.AUTHORIZED, UserTypes.PLANNING],
        allWithoutPlanningAndSergeant: [UserTypes.SUPERADMIN, UserTypes.RESOURCE_MANAGER, UserTypes.AUTHORIZED],
        allWithoutAuthorizedAndSergeant: [UserTypes.SUPERADMIN, UserTypes.RESOURCE_MANAGER, UserTypes.PLANNING],
        superadmin: [UserTypes.SUPERADMIN],
        superadminWithVisitor: [UserTypes.SUPERADMIN, UserTypes.VISITOR],
        resourceManager: [UserTypes.SUPERADMIN, UserTypes.RESOURCE_MANAGER],
        planning: [UserTypes.SUPERADMIN, UserTypes.PLANNING],
        authorized: [UserTypes.SUPERADMIN, UserTypes.AUTHORIZED, UserTypes.VISITOR],
        allWithBasicUser: [
            UserTypes.SUPERADMIN,
            UserTypes.RESOURCE_MANAGER,
            UserTypes.PLANNING,
            UserTypes.AUTHORIZED,
            UserTypes.SERGEANT,
            UserTypes.BASIC_USER,
        ],
        mainPageUnauthorized: [UserTypes.AUTHORIZED, UserTypes.PLANNING, UserTypes.SERGEANT, UserTypes.BASIC_USER],
        allWithoutPlanningAndVisitor: [UserTypes.SUPERADMIN, UserTypes.RESOURCE_MANAGER, UserTypes.AUTHORIZED, UserTypes.SERGEANT],
        planningWithVisitor: [UserTypes.SUPERADMIN, UserTypes.PLANNING, UserTypes.VISITOR],
    },

    magicWidth: '39.4%',
    limitForEventsInMainPage: 4,

    datesForEventsAdjoinedToCourseByDefault: {
        beforeDate: 14,
        afterDate: 7,
    },

    aggrid: {
        rowHeight: 50,
        paginationPageSize: 10,
        maxBlocksInCache: 1000,

        cellPadding: 46,
        iconButtonWidth: 46,
        headerNameWidth: 100,
    },

    sidebar: {
        drawerWidth: 300,
        closedDrawerWidth: 60,
        closedSidebarWidth: 2.5,
        openSidebarWidth: 3.5,
    },

    colors: {
        sidebarHighlightColor: '#f0f4fc',
        [RoomTypes.CLASS]: {
            primary: '#FFA064',
            secondary: '#FFCEB7',
        },
        [RoomTypes.OFFICE]: {
            primary: '#FF7BA4',
            secondary: '#F5B1CB',
        },
        [RoomTypes.BEDROOM]: {
            primary: '#D17EFA',
            secondary: '#E8CCFF',
        },
        box: {
            primary: '#FFFFFF',
        },
        button: {
            errorPrimary: '#FFEBF2',
            errorSecondary: '#FF7BA4',
            successPrimary: '#e6f1fc',
            successSecondary: '#0d47a1',
            white: 'white',
        },
        addResource: { background: '#F2F6FF 0% 0% no-repeat padding-box', border: '1px solid #5B88F3', color: '#5886F3' },
        addResourceYearly: { background: '#FFEBF2 0% 0% no-repeat padding-box', border: '1px solid #FFA064', color: '#FFA064' },
        viewResourceYearly: { background: '#F2F6FF 0% 0% no-repeat padding-box', border: '1px solid #5B88F3', color: '#5B88F3' },
        viewResource: { background: '#FFEBF2 0% 0% no-repeat padding-box', border: '1px solid #FF7BA4', color: '#FF7BA4' },
        yearlyGraphTable: {
            addResource: '#E7E8EA',
            viewResource: '#FFFFFF',
            box: {
                primary: '#FFFFFF',
            },
            button: {
                primary: '#FFEBF2',
                secondary: '#FF7BA4',
            },
        },
        piecharts: {
            [`${RoomTypes.CLASS}Gradient`]: 'linear-gradient(145deg, #FFA064, #ED7466)',
            [`${RoomTypes.OFFICE}Gradient`]: 'linear-gradient(143deg, #FF7BA4, #CF75AF)',
            [`${RoomTypes.BEDROOM}Gradient`]: 'linear-gradient(145deg, #D17EFA, #A26FE7)',
        },
        singleCube: {
            soldiers: 'linear-gradient(136deg, #B6C6F8, #A1A6FF)',
            courses: 'linear-gradient(136deg, #B2D4FF, #8EB5FF)',
        },
        backgroundColorSignleCube: {
            soldiers: 'linear-gradient(123deg, #7B9FFC, #9671F1)',
            courses: 'linear-gradient(122deg, #61ADFE, #6C7EF1)',
        },
        backgroundColorStatisticElement: {
            soldiers: 'linear-gradient(136deg, #B6C6F8, #A1A6FF)',
            courses: 'linear-gradient(136deg, #F5B1CB, #F38FA1)',
        },
        resourceState: {
            empty: '#E077AB',
            occupied: '#688FF6',
            full: '#F78D65',
        },
        coursesGantt: {
            active: '#64A1FA',
            future: '#BA77F1',
            done: '#F78D65',
            extraCourses: '#0FB014',
        },
        gender: {
            male: '#688FF6',
            female: '#E077AB',
            otherMale: '#FFA064',
            otherFemale: '#0FB014',
        },
    },
    piecharts: {
        [`${RoomTypes.CLASS}Gradient`]: 'linear-gradient(145deg, #FFA064, #ED7466)',
        [`${RoomTypes.OFFICE}Gradient`]: 'linear-gradient(143deg, #FF7BA4, #CF75AF)',
        [`${RoomTypes.BEDROOM}Gradient`]: 'linear-gradient(145deg, #D17EFA, #A26FE7)',
    },
    singleCube: {
        soldiers: 'linear-gradient(136deg, #B6C6F8, #A1A6FF)',
        courses: 'linear-gradient(136deg, #B2D4FF, #8EB5FF)',
    },
    backgroundColorSignleCube: {
        soldiers: 'linear-gradient(123deg, #7B9FFC, #9671F1)',
        courses: 'linear-gradient(122deg, #61ADFE, #6C7EF1)',
    },
    backgroundColorStatisticElement: {
        soldiers: 'linear-gradient(136deg, #B6C6F8, #A1A6FF)',
        courses: 'linear-gradient(136deg, #F5B1CB, #F38FA1)',
    },
    defaultRangeInDays: 14,

    logMetaDataColumnSize: {
        [ActivityTypes.COURSE]: 3,
        [ActivityTypes.EVENT]: 2,
        [ActivityTypes.COURSE_TEMPLATE]: 2,
        [ActivityTypes.ROOM_IN_COURSE]: 1,
        [ActivityTypes.ROOM_IN_EVENT]: 1,
        [ActivityTypes.PERMISSION]: 1,
        [ActivityTypes.REQUEST]: 1,
        [ActivityTypes.EXCEL]: 1,
        [ActivityTypes.SOLDIER_IN_EVENT]: 1,
        [ActivityTypes.SOLDIERS_IN_ROOM_IN_EVENT]: 1,
        [ActivityTypes.SOLDIERS_IN_ROOM_IN_COURSE]: 1,
    },
};
