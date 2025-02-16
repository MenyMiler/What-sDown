import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { ReplaceSoldiersInBedrooms, replaceSoldiersInBedroomsSchema } from '../replaceSoldiersInBedrooms/ReplaceSoldiersInBedrooms';

const replaceStaffInBedroomsSteps: ArrayWithAtLeastOneStep = [
    { content: () => ReplaceSoldiersInBedrooms(true), schema: replaceSoldiersInBedroomsSchema },
];

const replaceStaffInBedroomsModal = {
    title: 'wizard.replaceStaffInBedrooms.title',
    steps: replaceStaffInBedroomsSteps,
    request: () => {},
};

export default replaceStaffInBedroomsModal;
