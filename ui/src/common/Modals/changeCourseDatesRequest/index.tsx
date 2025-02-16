import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { ChangeDatesMetadata } from '../../../interfaces/request/metadata';
import { Types } from '../../../interfaces/user';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { ChangeDates, changeDatesSchema } from './steps/ChangeDates';

const changeCourseDatesSteps: ArrayWithAtLeastOneStep = [{ content: ChangeDates, schema: changeDatesSchema }];

const changeCourseDatesRequest = async (data: any) => {
    const { baseId, requesterId, userType, ...metaData } = data;
    const { courseId, newStartDate, newEndDate } = metaData as ChangeDatesMetadata;

    try {
        if (new Date(newEndDate).getTime() <= new Date().getTime()) throw new Error();

        await RequestsService.createOne({
            baseId,
            requesterId,
            type: RequestTypes.CHANGE_DATES,
            metaData: { courseId, newStartDate, newEndDate } as ChangeDatesMetadata,
        });
        localStorage.removeItem(RequestTypes.CHANGE_DATES);
        toast.success(userType === Types.SUPERADMIN ? i18next.t('wizard.superAdminSuccess') : i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(new Date(newEndDate).getTime() <= new Date().getTime() ? i18next.t('wizard.pastCourse') : i18next.t('wizard.error'));
    }
};

const changeCourseDatesModal = {
    title: 'wizard.changeCourseDatesRequest.changeCourseDates',
    steps: changeCourseDatesSteps,
    request: changeCourseDatesRequest,
};

export default changeCourseDatesModal;
