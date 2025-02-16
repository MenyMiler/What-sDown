import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { AddClassOrOfficeToCourseOrEventMetadata } from '../../../interfaces/request/metadata';
import { RoomTypes } from '../../../interfaces/room';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { basicInfoSchema, OfficeRequest } from './officeToEventCourseRequest';

const addOfficeRequestSteps: ArrayWithAtLeastOneStep = [{ content: OfficeRequest, schema: basicInfoSchema }];

const addInstanceOfOfficeToEventRequest = async (data: any) => {
    const { baseId, requesterId, ...metaData } = data;
    const { eventId, amount, comments } = metaData as AddClassOrOfficeToCourseOrEventMetadata;

    try {
        await RequestsService.createOne({
            baseId,
            requesterId,
            type: RequestTypes.NEW_OFFICE_TO_EVENT,
            metaData: { eventId, amount, comments, type: RoomTypes.OFFICE },
        });
        localStorage.removeItem(RequestTypes.NEW_OFFICE_TO_EVENT);
        toast.success(i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

export const addInstanceOfOfficeToEventRequestModal = {
    title: 'wizard.addFacilityRequest.office',
    steps: addOfficeRequestSteps,
    request: (data: any) => addInstanceOfOfficeToEventRequest(data),
};
