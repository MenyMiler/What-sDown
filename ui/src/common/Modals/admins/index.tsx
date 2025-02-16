import * as yup from 'yup';
import { RequestTypes } from '../../../interfaces/request';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { AddAdmins } from './addAdmins';

const addAdminsRequestSteps: ArrayWithAtLeastOneStep = [
    {
        content: AddAdmins,
        schema: yup.object(),
    },
];

export const addAdminsRequestModal = {
    title: 'sideBar.resourceManagement.admins',
    steps: addAdminsRequestSteps,
    request: () => localStorage.removeItem(RequestTypes.PERMISSION),
};
