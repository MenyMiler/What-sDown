import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { CreateEventMetadata } from '../../../interfaces/request/metadata';
import { Types } from '../../../interfaces/user';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { basicInfoSchema, EventRequest } from './createEventRequest';

const createEventRequestSteps: ArrayWithAtLeastOneStep = [{ content: EventRequest, schema: basicInfoSchema }];

const createEventRequest = async (data: any) => {
    const { baseId, requesterId, userType, ...metaData } = data;
    const { name, amount, startDate, endDate, description } = metaData as CreateEventMetadata;

    try {
        await RequestsService.createOne({
            baseId,
            requesterId,
            type: RequestTypes.NEW_EVENT,
            metaData: {
                name,
                amount,
                startDate,
                endDate,
                description,
            } as CreateEventMetadata,
        });
        localStorage.removeItem(RequestTypes.NEW_EVENT);
        toast.success(userType === Types.SUPERADMIN ? i18next.t('wizard.superAdminSuccess') : i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

const createEventToCourseModal = {
    title: 'wizard.createEvent.createEventRequest',
    steps: createEventRequestSteps,
    request: createEventRequest,
};

export default createEventToCourseModal;
