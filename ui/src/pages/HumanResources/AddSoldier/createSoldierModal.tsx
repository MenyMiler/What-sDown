import i18next from 'i18next';
import { toast } from 'react-toastify';
import { ArrayWithAtLeastOneStep } from '../../../common/Modals/GenericModalForm';
import { SoldierTypes } from '../../../interfaces/soldier';
import { SoldiersInRoomInCourseService } from '../../../services/soldiersInRoomInCourse';
import { addSoldierToCourseInfoSchema, createSoldierForm } from './createSoldierForm';

const addPersonToCourseRequestSteps = (isStaff: boolean): ArrayWithAtLeastOneStep => [
    { content: () => createSoldierForm({ isStaff }), schema: addSoldierToCourseInfoSchema },
];

const AddPersonToCourseRequest = async (data: any, type: SoldierTypes, courseId: string) => {
    const { baseId, requesterId, exceptional, ...metaData } = data;

    try {
        await SoldiersInRoomInCourseService.createSoldiersAndAddToRoomInCourse(courseId, [
            { ...metaData, soldierType: type, exceptional: Boolean(exceptional === 'yes') },
        ]);
        toast.success(i18next.t('editUser.success'));
    } catch ({
        response: {
            data: { message },
        },
    }: any) {
        if (message !== 'API call failed: Request failed with status code 409') throw new Error(i18next.t(`editUser.errors.${message}`));
    }
};

const addToCourseModal = (courseId: string, isStaff: boolean) => ({
    title: i18next.t(`editUser.modals.titles.${isStaff ? 'addStaff' : 'addStudent'}`),
    steps: addPersonToCourseRequestSteps(isStaff),
    request: (data: any) => AddPersonToCourseRequest(data, isStaff ? SoldierTypes.STAFF : SoldierTypes.STUDENT, courseId),
});

export default addToCourseModal;
