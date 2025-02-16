import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { NewEventRelatedToCourseMetadata } from '../../../interfaces/request/metadata';
import { Types } from '../../../interfaces/user';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { basicInfoSchema, EventRequest } from './createEventToCourseRequest';

const createEventRequestSteps: ArrayWithAtLeastOneStep = [{ content: EventRequest, schema: basicInfoSchema }];

const createEventToCourseRequest = async (data: any) => {
    const { baseId, requesterId, userType, ...metaData } = data;
    const { courseId, name, amount, startDate, endDate, description } = metaData as NewEventRelatedToCourseMetadata;

    try {
        await RequestsService.createOne({
            baseId,
            requesterId,
            type: RequestTypes.NEW_EVENT_RELATED_TO_COURSE,
            metaData: {
                courseId,
                name,
                amount,
                startDate,
                endDate,
                description,
                baseId,
            } as NewEventRelatedToCourseMetadata,
        });
        localStorage.removeItem(RequestTypes.NEW_EVENT_RELATED_TO_COURSE);
        toast.success(userType === Types.SUPERADMIN ? i18next.t('wizard.superAdminSuccess') : i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

const createEventToCourseModal = {
    title: 'wizard.addBedroomToEventCourseRequest.createEventRequest',
    steps: createEventRequestSteps,
    request: createEventToCourseRequest,
};

export default createEventToCourseModal;
