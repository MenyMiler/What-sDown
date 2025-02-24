

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
};
