import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { AddClassOrOfficeToCourseOrEventMetadata } from '../../../interfaces/request/metadata';
import { RoomTypes } from '../../../interfaces/room';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { basicInfoSchema, ClassRequest } from './classToEventCourseRequest';

const addClassRequestSteps: ArrayWithAtLeastOneStep = [{ content: ClassRequest, schema: basicInfoSchema }];

const addInstanceOfClassRequest = async (data: any) => {
    const { baseId, requesterId, ...metaData } = data;
    const { eventId, amount, comments } = metaData as AddClassOrOfficeToCourseOrEventMetadata;

    try {
        await RequestsService.createOne({
            baseId,
            requesterId,
            type: RequestTypes.NEW_CLASS_TO_EVENT,
            metaData: { eventId, amount, comments, type: RoomTypes.CLASS },
        });
        localStorage.removeItem(RequestTypes.NEW_CLASS_TO_EVENT);
        toast.success(i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

export const addInstanceOfClassToEventCourseRequestModal = {
    title: 'wizard.addFacilityRequest.class',
    steps: addClassRequestSteps,
    request: (data: any) => addInstanceOfClassRequest(data),
};
