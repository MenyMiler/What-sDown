import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { RoomTypes } from '../../../interfaces/room';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { basicInfoSchema, ClassRequest } from './classRequest';

const addClassRequestSteps: ArrayWithAtLeastOneStep = [{ content: ClassRequest, schema: basicInfoSchema }];

const addInstanceOfClassRequest = async (data: any) => {
    const { baseId, requesterId, ...metaData } = data;
    const { courseId, amount, comments, networkId } = metaData;

    try {
        await RequestsService.createOne({
            baseId,
            requesterId,
            type: RequestTypes.NEW_CLASS,
            metaData: { courseId, amount, comments, type: RoomTypes.CLASS, networkId },
        });
        localStorage.removeItem(RequestTypes.NEW_CLASS);
        toast.success(i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

export const addInstanceOfClassRequestModal = {
    title: 'wizard.addFacilityRequest.class',
    steps: addClassRequestSteps,
    request: (data: any) => addInstanceOfClassRequest(data),
};
