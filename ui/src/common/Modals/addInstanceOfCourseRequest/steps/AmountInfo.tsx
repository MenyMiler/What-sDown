import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { RequestTypes } from '../../../../interfaces/request';
import { Genders } from '../../../../interfaces/soldier';
import { minMax, optionalNumber } from '../../../../utils/yup';
import SnackBar from '../../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../../modals.styled';

const amountInfoSchema = yup.object({
    amountOfFemale: minMax(0),
    amountOfMale: minMax(0),
    amountOfOtherFemale: minMax(0),
    amountOfOtherMale: minMax(0),
    staffRatio: optionalNumber,
});

const AmountInfo = () => (
    <GridWrapper container>
        <SnackBar isNextSteps requestType={RequestTypes.NEW_COURSE} />
        <GridWithMultipleItems container>
            <TextFieldElement
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                name="amountOfFemale"
                label={i18next.t(`common.genders.${Genders.FEMALE}`)}
                required
            />
            <TextFieldElement
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                name="amountOfMale"
                label={i18next.t(`common.genders.${Genders.MALE}`)}
                required
            />
        </GridWithMultipleItems>

        <GridWithMultipleItems container>
            <TextFieldElement
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                name="amountOfOtherFemale"
                label={i18next.t(`common.genders.${Genders.OTHER_FEMALE}`)}
                required
            />
            <TextFieldElement
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                name="amountOfOtherMale"
                label={i18next.t(`common.genders.${Genders.OTHER_MALE}`)}
                required
            />
        </GridWithMultipleItems>

        <Grid container justifyContent="center" gap="1rem">
            <TextFieldElement
                name="staffRatio"
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ width: '35%' }}
                label={i18next.t('common.staffRatio')}
            />
            <Typography sx={{ color: 'gray', fontSize: '1.5rem', mt: '0.5rem' }}>: 1</Typography>
        </Grid>
    </GridWrapper>
);

export { AmountInfo, amountInfoSchema };
