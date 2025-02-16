import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { ReplaceSoldiersInBedrooms, replaceSoldiersInBedroomsSchema } from './ReplaceSoldiersInBedrooms';

const replaceSoldiersInBedroomsSteps: ArrayWithAtLeastOneStep = [
    { content: () => ReplaceSoldiersInBedrooms(false), schema: replaceSoldiersInBedroomsSchema },
];

const replaceSoldiersInBedroomsModal = {
    title: 'wizard.replaceSoldiersInBedrooms.title',
    steps: replaceSoldiersInBedroomsSteps,
    request: () => {},
};

export default replaceSoldiersInBedroomsModal;
