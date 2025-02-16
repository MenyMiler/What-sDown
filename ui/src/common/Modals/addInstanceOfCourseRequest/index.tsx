import i18next from 'i18next';
import { toast } from 'react-toastify';
import { RequestTypes } from '../../../interfaces/request';
import { Types } from '../../../interfaces/user';
import { RequestsService } from '../../../services/requests';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { AmountInfo, amountInfoSchema } from './steps/AmountInfo';
import { BasicInfo, basicInfoSchema } from './steps/BasicInfo';
import { CreationMode, creationModeSchema } from './steps/CreationMode';
import { DatesInfo, datesInfoSchema } from './steps/DatesInfo';
import { EventsInfo, eventsInfoSchema } from './steps/EventsInfo';

const addInstanceOfCourseRequestSteps: ArrayWithAtLeastOneStep = [
    { content: CreationMode, schema: creationModeSchema },
    { content: BasicInfo, schema: basicInfoSchema },
    { content: AmountInfo, schema: amountInfoSchema },
    { content: DatesInfo, schema: datesInfoSchema },
    { content: EventsInfo, schema: eventsInfoSchema },
];

const addInstanceOfCourseRequest = async (data: any) => {
    const {
        baseId,
        courseBaseId,
        userType,
        requesterId,
        amountOfMale,
        amountOfFemale,
        amountOfOtherMale,
        amountOfOtherFemale,
        startDatePreEvent,
        endDatePreEvent,
        startDatePostEvent,
        endDatePostEvent,
        ...metaData
    } = data;

    const {
        creationMode: _creationMode,
        courseTemplateId: _courseTemplateId,
        courseId: _courseId,
        bootCampStartDate,
        bootCampEndDate,
        receivanceDate,
        _isSavedInputValues,
        ...rest
    } = metaData;
    const soldierAmounts = { MALE: amountOfMale, FEMALE: amountOfFemale, OTHER_MALE: amountOfOtherMale, OTHER_FEMALE: amountOfOtherFemale };
    const eventsDates = {
        ...(startDatePreEvent && { startDatePreEvent }),
        ...(endDatePreEvent && { endDatePreEvent }),
        ...(startDatePostEvent && { startDatePostEvent }),
        ...(endDatePostEvent && { endDatePostEvent }),
    };

    try {
        await RequestsService.createOne({
            baseId: courseBaseId,
            requesterId,
            type: RequestTypes.NEW_COURSE,
            metaData: {
                ...rest,
                ...(bootCampStartDate ? { bootCampStartDate } : {}),
                ...(bootCampEndDate ? { bootCampEndDate } : {}),
                ...(receivanceDate ? { receivanceDate } : {}),
                baseId: courseBaseId,
                soldierAmounts,
                eventsDates,
            },
        });
        toast.success(userType === Types.SUPERADMIN ? i18next.t('wizard.superAdminSuccess') : i18next.t('wizard.success'));
    } catch (error) {
        throw new Error(i18next.t('wizard.error'));
    }
};

const addInstanceOfCourseModal = {
    title: 'wizard.addInstanceOfCourseRequest.addInstanceOfCourse',
    steps: addInstanceOfCourseRequestSteps,
    request: addInstanceOfCourseRequest,
};

export default addInstanceOfCourseModal;
