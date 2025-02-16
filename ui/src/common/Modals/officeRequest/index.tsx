import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { RoomTypes } from '../../../interfaces/room';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { basicInfoSchema, OfficeRequest } from './officeRequest';

const addOfficeRequestSteps: ArrayWithAtLeastOneStep = [{ content: OfficeRequest, schema: basicInfoSchema }];

const addInstanceOfOfficeRequest = async (data: any) => {
    const { baseId, requesterId, ...metaData } = data;
    const { courseId, amount, comments, networkId } = metaData;

    try {
        await RequestsService.createOne({
            baseId,
            requesterId,
            type: RequestTypes.NEW_OFFICE,
            metaData: { courseId, amount, comments, type: RoomTypes.OFFICE, networkId },
        });
        localStorage.removeItem(RequestTypes.NEW_OFFICE);
        toast.success(i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

export const addInstanceOfOfficeRequestModal = {
    title: 'wizard.addFacilityRequest.office',
    steps: addOfficeRequestSteps,
    request: (data: any) => addInstanceOfOfficeRequest(data),
};
