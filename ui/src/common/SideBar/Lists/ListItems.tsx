import {
    Add,
    Assessment,
    BusinessCenter,
    CalendarToday,
    Edit,
    Event,
    EventAvailableOutlined,
    FormatShapes,
    FormatTextdirectionRToL,
    Home,
    MilitaryTech,
    People,
    School,
    Source,
    SwapHoriz,
} from '@mui/icons-material';
import { environment } from '../../../globals';
import { SoldierTypes } from '../../../interfaces/soldier';
import { addSoldierBedroomToCourseModal, addStaffBedroomToCourseModal } from '../../Modals/addBedroomToCourseRequest';
import { addSoldierBedroomToEventCourseModal, addStaffBedroomToEventCourseModal } from '../../Modals/addBedroomToEventCourseRequest';
import addInstanceOfCourseModal from '../../Modals/addInstanceOfCourseRequest';
import changeCourseDatesModal from '../../Modals/changeCourseDatesRequest';
import { addInstanceOfClassRequestModal } from '../../Modals/classRequest';
import { addInstanceOfClassToEventCourseRequestModal } from '../../Modals/classToEventCourseRequest';
import createCourseTemplateModal from '../../Modals/createCourseTemplateRequest';
import createEventRequest from '../../Modals/createEventRequest';
import createEventToCourseModal from '../../Modals/createEventToCourseRequest';
import editSoldierAmountsInCourseModal from '../../Modals/editSoldiersAmountInCourseRequest';
import { addInstanceOfOfficeRequestModal } from '../../Modals/officeRequest';
import { addInstanceOfOfficeToEventRequestModal } from '../../Modals/officeToEventCourseRequest';
import replaceSoldiersInBedroomsModal from '../../Modals/replaceSoldiersInBedrooms';
import replaceStaffInBedroomsModal from '../../Modals/replaceStaffInBedrooms';
import { transferSoldierAmountsRequestModal } from '../../Modals/transferSoldiersAmount';
import { IList } from './List/ListItem';
import { ReactComponent as Group783 } from '../../../svgs/Group783.svg';
import { ReactComponent as mapSchool } from '../../../svgs/Icon map-school.svg';

const { permissions } = environment;

export const resourceRequestsListItems: IList[] = [
    {
        Icon: Add,
        text: 'sideBar.resourceRequests.class',
        ModalContent: addInstanceOfClassRequestModal,
        allowedUsers: permissions.allWithBasicUser,
    },
    {
        Icon: Add,
        text: 'sideBar.resourceRequests.office',
        ModalContent: addInstanceOfOfficeRequestModal,
        allowedUsers: permissions.allWithBasicUser,
    },
    {
        Icon: Add,
        text: 'sideBar.resourceRequests.soldiersRoom',
        ModalContent: addSoldierBedroomToCourseModal,
        allowedUsers: permissions.allWithBasicUser,
    },
    {
        Icon: Add,
        text: 'sideBar.resourceRequests.staffRoom',
        ModalContent: addStaffBedroomToCourseModal,
        allowedUsers: permissions.allWithBasicUser,
    },
];

export const resourceEventsRequestsListItems: IList[] = [
    {
        Icon: Add,
        text: 'sideBar.resourceRequests.class',
        ModalContent: addInstanceOfClassToEventCourseRequestModal,
        allowedUsers: permissions.allWithBasicUser,
    },
    {
        Icon: Add,
        text: 'sideBar.resourceRequests.office',
        ModalContent: addInstanceOfOfficeToEventRequestModal,
        allowedUsers: permissions.allWithBasicUser,
    },
    {
        Icon: Add,
        text: 'sideBar.resourceRequests.soldiersRoom',
        ModalContent: addSoldierBedroomToEventCourseModal,
        allowedUsers: permissions.allWithBasicUser,
    },
    {
        Icon: Add,
        text: 'sideBar.resourceRequests.staffRoom',
        ModalContent: addStaffBedroomToEventCourseModal,
        allowedUsers: permissions.allWithBasicUser,
    },
];

export const courseRequestsListItems: IList[] = [
    {
        Icon: Edit,
        text: 'sideBar.courseRequests.editSoldierAmounts',
        ModalContent: editSoldierAmountsInCourseModal,
        allowedUsers: permissions.resourceManager,
    },
    {
        Icon: CalendarToday,
        text: 'sideBar.courseRequests.newDates',
        ModalContent: changeCourseDatesModal,
        allowedUsers: permissions.resourceManager,
    },
    {
        Icon: SwapHoriz,
        text: 'sideBar.courseRequests.replaceSoldiersInBedrooms',
        ModalContent: replaceSoldiersInBedroomsModal,
        allowedUsers: permissions.allWithoutSergeant,
    },
    {
        Icon: SwapHoriz,
        text: 'sideBar.courseRequests.replaceStaffInBedrooms',
        ModalContent: replaceStaffInBedroomsModal,
        allowedUsers: permissions.allWithoutSergeant,
    },
    {
        Icon: SwapHoriz,
        text: 'sideBar.courseRequests.transferSoldierAmounts',
        ModalContent: transferSoldierAmountsRequestModal,
        allowedUsers: permissions.planning,
    },
];

export const resourceManagementListItems: IList[] = [
    {
        Icon: Assessment,
        text: 'sideBar.resourceManagement.classesGraph',
        to: 'graph/classes',
        allowedUsers: permissions.allWithoutPlanning,
    },
    {
        Icon: BusinessCenter,
        text: 'sideBar.resourceManagement.officesGraph',
        to: 'graph/offices',
        allowedUsers: permissions.allWithoutPlanning,
    },
    {
        Icon: Home,
        text: 'sideBar.resourceManagement.bedroomsGraph',
        to: 'graph/bedrooms',
        allowedUsers: permissions.allWithoutPlanning,
    },
    {
        Icon: Event,
        text: 'sideBar.resourceManagement.EventsGraph',
        to: 'graph/events',
        allowedUsers: permissions.allWithoutPlanning,
    },
    {
        Icon: Source,
        text: 'sideBar.resourceManagement.dailyResourcesView',
        to: 'resource-management',
        allowedUsers: permissions.resourceManager,
    },
];

export const courseManagementListItems: IList[] = [
    {
        Icon: School,
        text: 'sideBar.courseManagement.coursesGraph',
        to: 'graph/courses',
        allowedUsers: permissions.allWithoutAuthorizedAndSergeant,
    },
    // {
    //     Icon: MilitaryTech,
    //     text: 'sideBar.courseManagement.recruitGraph',
    //     to: 'graph/recruit',
    //     allowedUsers: permissions.planning,
    // },
    {
        Icon: FormatTextdirectionRToL,
        text: 'sideBar.courseManagement.designAnnualGraph',
        to: 'graph/annual',
        allowedUsers: permissions.allWithoutAuthorizedAndSergeant,
    },
    {
        Icon: FormatShapes,
        text: 'sideBar.courseManagement.createCourseTemplate',
        ModalContent: createCourseTemplateModal,
        allowedUsers: permissions.allWithoutAuthorizedAndSergeant,
    },
    {
        Icon: Group783,
        text: 'sideBar.courseManagement.addInstanceOfCourse',
        ModalContent: addInstanceOfCourseModal,
        allowedUsers: permissions.allWithoutAuthorizedAndSergeant,
    },
    {
        Icon: EventAvailableOutlined,
        text: 'sideBar.courseManagement.createEvent',
        ModalContent: createEventRequest,
        allowedUsers: permissions.allWithoutPlanning,
    },
    {
        Icon: mapSchool,
        text: 'sideBar.courseManagement.createRelatedCourse',
        ModalContent: createEventToCourseModal,
        allowedUsers: permissions.allWithoutPlanningAndSergeant,
    },
];

export const humanResourcesManagementListItems: IList[] = [
    {
        Icon: People,
        text: 'sideBar.humanResources.staff',
        to: `soldiers/${SoldierTypes.STAFF.toLowerCase()}/edit`,
        allowedUsers: permissions.authorized,
    },
    {
        Icon: People,
        text: 'sideBar.humanResources.soldiers',
        to: `soldiers/${SoldierTypes.STUDENT.toLowerCase()}/edit`,
        allowedUsers: permissions.authorized,
    },
];
