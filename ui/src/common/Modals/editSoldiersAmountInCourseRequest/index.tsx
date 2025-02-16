import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { EditSoldierAmountsInCourseRequestMetadata } from '../../../interfaces/request/metadata';
import { Types } from '../../../interfaces/user';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { EditSoldierAmountsInCourseInfo, editSoldierAmountsInCourseInfoSchema } from './editSoldiersAmountInCourseInfo';

const editSoldierAmountsInCourseRequestSteps: ArrayWithAtLeastOneStep = [
    { content: EditSoldierAmountsInCourseInfo, schema: editSoldierAmountsInCourseInfoSchema },
];

const editSoldierAmountsInCourseRequest = async (data: any) => {
    const { baseId, requesterId, userType, courseId, ...metadata } = data;

    try {
        await RequestsService.createOne({
            baseId,
            requesterId,
            type: RequestTypes.EDIT_SOLDIERS_AMOUNT,
            metaData: {
                ...metadata,
                courseId,
            } as EditSoldierAmountsInCourseRequestMetadata,
        });
        localStorage.removeItem(RequestTypes.EDIT_SOLDIERS_AMOUNT);
        toast.success(userType === Types.SUPERADMIN ? i18next.t('wizard.superAdminSuccess') : i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

const editSoldierAmountsInCourseModal = {
    title: 'wizard.editSoldierAmountsInCourseRequest.editSoldierAmountsInCourseRequest',
    steps: editSoldierAmountsInCourseRequestSteps,
    request: editSoldierAmountsInCourseRequest,
};

export default editSoldierAmountsInCourseModal;
