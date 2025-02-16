/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { CreateCourseTemplateForMetadata, CreateTemplateMetadata } from '../../../interfaces/request/metadata';
import { Types } from '../../../interfaces/user';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { BaseInfo, baseInfoSchema } from './steps/BaseInfo';
import { CourseInfo, courseInfoSchema } from './steps/CourseInfo';

const createCourseTemplateRequestSteps: ArrayWithAtLeastOneStep = [
    { content: CourseInfo, schema: courseInfoSchema },
    { content: BaseInfo, schema: baseInfoSchema },
];

const createCourseTemplateRequest = async (data: CreateCourseTemplateForMetadata) => {
    const { requesterId, baseId, userType, _isSavedInputValues, staffRatio, ...metaData } = data;

    try {
        await RequestsService.createOne({
            baseId,
            requesterId,
            type: RequestTypes.NEW_COURSE_TEMPLATE,
            metaData: { baseId, ...(staffRatio && { staffRatio }), ...metaData } as CreateTemplateMetadata,
        });
        toast.success(userType === Types.SUPERADMIN ? i18next.t('wizard.superAdminSuccess') : i18next.t('wizard.success'));
    } catch (error: any) {
        throw new Error(i18next.t('wizard.error'));
    }
};

const createCourseTemplateModal = {
    title: 'wizard.createCourseTemplate.createCourseTemplate',
    steps: createCourseTemplateRequestSteps,
    request: createCourseTemplateRequest,
};

export default createCourseTemplateModal;
