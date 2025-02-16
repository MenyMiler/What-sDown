import { Grid } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { GridWithMultipleItems, GridWrapper } from '../../../common/Modals/modals.styled';
import { environment } from '../../../globals';
import { Genders, SpecialStudentTypes } from '../../../interfaces/soldier';
import { requiredString } from '../../../utils/yup';

const { magicWidth } = environment;

const addSoldierToCourseInfoSchema = yup.object({
    name: requiredString,
    personalNumber: requiredString.length(7, i18next.t('yupErrorMsg.personalNumber')),
    gender: requiredString,
    studentType: requiredString,
    exceptional: requiredString,
});
interface ICreateSoldierFormProps {
    isStaff: boolean;
}

const CreateSoldierForm = ({ isStaff }: ICreateSoldierFormProps) => {
    const { setValue } = useFormContext();
    setValue('studentType', SpecialStudentTypes.REGULAR);
    setValue('exceptional', 'no');

    return (
        <GridWrapper container>
            <GridWithMultipleItems container>
                <TextFieldElement name="name" label={i18next.t('editUser.table.category.name')} required />
                <TextFieldElement name="personalNumber" label={i18next.t('common.personalNumber')} required />
            </GridWithMultipleItems>
            <GridWithMultipleItems container>
                <SelectElement
                    name="gender"
                    label={i18next.t('wizard.addBedroomToCourseRequest.gender')}
                    options={Object.values(Genders).map((gender) => ({
                        label: i18next.t(`wizard.addBedroomToCourseRequest.${gender}`),
                        id: gender,
                    }))}
                    sx={{ width: magicWidth }}
                    required
                />
                <SelectElement
                    name="studentType"
                    label={i18next.t('editUser.table.specialStudentTitle')}
                    options={Object.values(SpecialStudentTypes).map((gender) => ({
                        label: i18next.t(`editUser.table.specialStudentType.${gender}`),
                        id: gender,
                    }))}
                    sx={{ width: magicWidth }}
                    required
                    disabled={isStaff}
                />
                <Grid item xs={12} container justifyContent="center">
                    <SelectElement
                        name="exceptional"
                        label={i18next.t('editUser.table.category.exceptional')}
                        options={[
                            { label: i18next.t('editUser.table.yes'), id: 'yes' },
                            { label: i18next.t('editUser.table.no'), id: 'no' },
                        ]}
                        defaultValue="no"
                        sx={{ width: magicWidth, marginTop: '7%' }}
                        required
                        disabled={isStaff}
                    />
                </Grid>
            </GridWithMultipleItems>
        </GridWrapper>
    );
};

export { addSoldierToCourseInfoSchema, CreateSoldierForm as createSoldierForm };
