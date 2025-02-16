import i18next from 'i18next';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { TransferSoldierAmountsRequestMetadata } from '../../../interfaces/request/metadata';
import { Types } from '../../../interfaces/user';
import { CoursesService } from '../../../services/courses';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { TransferSoldierAmountsRequest, transferSoldierAmountsInfoSchema } from './transferSoldiersAmountRequest';

const transferSoldierAmountsRequestSteps: ArrayWithAtLeastOneStep = [
    { content: TransferSoldierAmountsRequest, schema: transferSoldierAmountsInfoSchema },
];

const createRequest = async (baseId: string, requesterId: string, metaData: any, newSoldierAmounts: any) => {
    const { soldierAmounts } = newSoldierAmounts;
    return RequestsService.createOne({
        baseId,
        requesterId,
        type: RequestTypes.TRANSFER_SOLDIERS_AMOUNT,
        metaData: {
            ...metaData,
            soldierAmounts,
        } as TransferSoldierAmountsRequestMetadata,
    });
};

const transferSoldierAmountsRequest = async (data: any) => {
    const { baseId, requesterId, userType, ...metaData } = data;
    const { soldierAmountsDestCourse, courseId, destCourseId, endDate, startDate, endDateDestCourse, startDateDestCourse, ...rest } = metaData;

    try {
        const { soldierAmounts } = await CoursesService.getById(courseId, false);
        if (_.isEqual(soldierAmounts, rest.soldierAmounts)) return;

        const request = await createRequest(baseId, requesterId, metaData, rest);
        if (request) {
            localStorage.removeItem(RequestTypes.TRANSFER_SOLDIERS_AMOUNT);
            toast.success(userType === Types.SUPERADMIN ? i18next.t('wizard.superAdminSuccess') : i18next.t('wizard.success'));
        }
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

export const transferSoldierAmountsRequestModal = {
    title: 'wizard.transferSoldierAmountsRequest.transferSoldierAmounts',
    steps: transferSoldierAmountsRequestSteps,
    request: transferSoldierAmountsRequest,
};
