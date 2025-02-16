/* eslint-disable jsx-a11y/anchor-is-valid */
import { FormControlLabel, Grid, Link, Radio, RadioGroup } from '@mui/material';
import * as React from 'react';
import i18next from 'i18next';
import { Genders } from '../../../interfaces/soldier';
import FilterTitle from '../filterTitle';

interface IGenderFilter {
    setFilter: (newValue: any) => void;
    currentGender: string | undefined;
}

const GenderFilter = ({ setFilter, currentGender }: IGenderFilter) => {
    const genders = Object.values(Genders);

    const handleChange = (newValue: string | null) => {
        setFilter((curr: {}) => ({ ...curr, ...{ gender: newValue || undefined } }));
    };

    return (
        <Grid container>
            <FilterTitle disabled={!currentGender} resetFilter={() => handleChange(null)} title="filterGantt.gender" />

            <Grid item>
                <RadioGroup sx={{ ml: '1rem' }} value={currentGender} row onChange={(event) => handleChange(event.target.value)}>
                    {genders.map((gender) => (
                        <FormControlLabel key={gender} label={i18next.t(`common.genders.${gender}`)} control={<Radio />} value={gender} />
                    ))}
                </RadioGroup>
            </Grid>
        </Grid>
    );
};

export default GenderFilter;
