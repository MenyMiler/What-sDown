import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { addBedroomToCourseOrEventMetadataSchema } from '../../../interfaces/request/metadata';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { AddBedroomToCourseInfo, addSoldierToCourseInfoSchema } from './addBedroomToCourse';

const addSoldiersBedroomToCourseRequestSteps: ArrayWithAtLeastOneStep = [
    { content: () => AddBedroomToCourseInfo(RequestTypes.ADD_SOLDIER_BEDROOM_TO_COURSE), schema: addSoldierToCourseInfoSchema },
];
const addStaffBedroomToCourseRequestSteps: ArrayWithAtLeastOneStep = [
    { content: () => AddBedroomToCourseInfo(RequestTypes.ADD_STAFF_BEDROOM_TO_COURSE), schema: addSoldierToCourseInfoSchema },
];

const addBedroomToCourseRequest = async (data: any, type: RequestTypes.ADD_SOLDIER_BEDROOM_TO_COURSE | RequestTypes.ADD_STAFF_BEDROOM_TO_COURSE) => {
    const { baseId, requesterId, ...metaData } = data;
    const { courseId, gender, amount } = metaData as addBedroomToCourseOrEventMetadataSchema;

    try {
        await RequestsService.createOne({
            baseId,
            requesterId,
            type,
            metaData: { courseId, gender, amount } as addBedroomToCourseOrEventMetadataSchema,
        });
        localStorage.removeItem(type);
        toast.success(i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

const addSoldierBedroomToCourseModal = {
    title: 'wizard.addBedroomToCourseRequest.addSoldierBedroomToCourseRequest',
    steps: addSoldiersBedroomToCourseRequestSteps,
    request: (data: any) => addBedroomToCourseRequest(data, RequestTypes.ADD_SOLDIER_BEDROOM_TO_COURSE),
};

const addStaffBedroomToCourseModal = {
    title: 'wizard.addBedroomToCourseRequest.addStaffBedroomToCourseRequest',
    steps: addStaffBedroomToCourseRequestSteps,
    request: (data: any) => addBedroomToCourseRequest(data, RequestTypes.ADD_STAFF_BEDROOM_TO_COURSE),
};

export { addSoldierBedroomToCourseModal, addStaffBedroomToCourseModal };
