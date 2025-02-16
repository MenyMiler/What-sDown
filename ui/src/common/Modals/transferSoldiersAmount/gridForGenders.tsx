/* eslint-disable import/no-unresolved */
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Grid } from '@mui/material';
import React from 'react';
import { GridWithMultipleItems } from '../modals.styled';
import TextFieldElementForGender from './textFieldElementForGender';

interface IGridForGendersProps {
    gender: string;
    handleChange: ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GridForGenders = ({ gender, handleChange }: IGridForGendersProps) => (
    <Grid item sx={{ marginTop: '2%' }}>
        <GridWithMultipleItems container>
            <TextFieldElementForGender name={gender} handleChange={handleChange} />
            <KeyboardDoubleArrowLeftIcon sx={{ marginTop: '2.5%' }} color="primary" />
            <TextFieldElementForGender disabled name={gender} />
        </GridWithMultipleItems>
    </Grid>
);

export default GridForGenders;
