/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable indent */
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';
import * as React from 'react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement } from 'react-hook-form-mui';
import { environment } from '../../../globals';
import { RequestTypes } from '../../../interfaces/request';
import { Types as UserTypes } from '../../../interfaces/user';
import { BasesService } from '../../../services/bases';
import { useUserStore } from '../../../stores/user';
import { setValues } from '../../../utils/wizard';
import SnackBar from '../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../modals.styled';
import AdminsTable from './adminTable';

const { magicWidth } = environment;

enum UserTypesAdminPage {
    SUPERADMIN = UserTypes.SUPERADMIN,
    RESOURCE_MANAGER = UserTypes.RESOURCE_MANAGER,
    PLANNING = UserTypes.PLANNING,
    SERGEANT = UserTypes.SERGEANT,
    AUTHORIZED = UserTypes.AUTHORIZED,
}

const AddAdmins = () => {
    const { setValue } = useFormContext();
    const currentUser = useUserStore(({ user }) => user);
    const isPlanning = currentUser.currentUserType! === UserTypes.PLANNING;

    const { data: bases } = useQuery({
        queryKey: ['bases'],
        queryFn: () => BasesService.getByQuery(),
        meta: { errorMessage: i18next.t('wizard.admins.errors.baseError') },
        initialData: [],
    });

    const getUserOptions = (): UserTypesAdminPage[] => {
        switch (currentUser.currentUserType) {
            case UserTypes.PLANNING:
                return [UserTypesAdminPage.PLANNING];
            case UserTypes.SUPERADMIN:
                return Object.values(UserTypesAdminPage);
            default:
                return [];
        }
    };

    const values = {
        userType: '',
    };

    const setDisableTextField = () => {
        setValues<typeof values>(
            {
                userType: currentUser.currentUserType!,
            },
            setValue,
        );
    };

    useEffect(() => {
        if (isPlanning) setDisableTextField();
    }, []);

    return (
        <GridWrapper container>
            <SnackBar requestType={RequestTypes.PERMISSION} />
            <GridWithMultipleItems container>
                <SelectElement
                    name="userType"
                    label={i18next.t('wizard.admins.userType')}
                    options={getUserOptions().map((option) => ({ id: option, label: i18next.t(`userTypes.${option}`) }))}
                    sx={{ width: magicWidth }}
                    disabled={isPlanning}
                    required={!isPlanning}
                />
                <SelectElement
                    name="base"
                    label={i18next.t('wizard.admins.bases')}
                    options={bases.map(({ name: label, _id: id }) => ({ id, label }))}
                    sx={{ width: magicWidth }}
                    required
                />
            </GridWithMultipleItems>

            <AdminsTable />
        </GridWrapper>
    );
};

export { AddAdmins };
