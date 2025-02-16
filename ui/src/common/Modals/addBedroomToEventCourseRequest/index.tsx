import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { addBedroomToCourseOrEventMetadataSchema } from '../../../interfaces/request/metadata';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { AddBedroomToEventCourseInfo, addSoldierToEventCourseInfoSchema } from './addBedroomToEventCourse';

const addSoldiersBedroomToEventCourseRequestSteps: ArrayWithAtLeastOneStep = [
    { content: () => AddBedroomToEventCourseInfo(RequestTypes.ADD_SOLDIER_BEDROOM_TO_EVENT_TO_COURSE), schema: addSoldierToEventCourseInfoSchema },
];
const addStaffBedroomToEventCourseRequestSteps: ArrayWithAtLeastOneStep = [
    { content: () => AddBedroomToEventCourseInfo(RequestTypes.ADD_STAFF_BEDROOM_TO_EVENT_TO_COURSE), schema: addSoldierToEventCourseInfoSchema },
];

const addBedroomToEventRequest = async (
    data: any,
    type: RequestTypes.ADD_SOLDIER_BEDROOM_TO_EVENT_TO_COURSE | RequestTypes.ADD_STAFF_BEDROOM_TO_EVENT_TO_COURSE,
) => {
    const { baseId, requesterId, ...metaData } = data;
    const { gender, amount, eventId } = metaData as addBedroomToCourseOrEventMetadataSchema;
    try {
        await RequestsService.createOne({
            baseId,
            requesterId,
            type,
            metaData: { gender, amount, eventId },
        });
        localStorage.removeItem(type);
        toast.success(i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

const addSoldierBedroomToEventCourseModal = {
    title: 'wizard.addBedroomToCourseRequest.addSoldierBedroomToCourseRequest',
    steps: addSoldiersBedroomToEventCourseRequestSteps,
    request: (data: any) => addBedroomToEventRequest(data, RequestTypes.ADD_SOLDIER_BEDROOM_TO_EVENT_TO_COURSE),
};

const addStaffBedroomToEventCourseModal = {
    title: 'wizard.addBedroomToCourseRequest.addStaffBedroomToCourseRequest',
    steps: addStaffBedroomToEventCourseRequestSteps,
    request: (data: any) => addBedroomToEventRequest(data, RequestTypes.ADD_STAFF_BEDROOM_TO_EVENT_TO_COURSE),
};

export { addSoldierBedroomToEventCourseModal, addStaffBedroomToEventCourseModal };
