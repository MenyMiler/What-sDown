/* eslint-disable jsx-a11y/anchor-is-valid */
import { Chip, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import * as React from 'react';
import i18next from 'i18next';
import { BedroomModes } from '../../ganttTask/types/public-types';

interface IOccupationStatusFilterProps {
    setFilter: (newValue: any) => void;
    currentStatus: string;
}

const OccupationStatusFilter = ({ setFilter, currentStatus }: IOccupationStatusFilterProps) => {
    const bedroomsModes = Object.values(BedroomModes);

    const handleChange = (newValue: string) => {
        setFilter((curr: {}) => ({ ...curr, ...{ occupation: newValue } }));
    };

    return (
        <Grid container>
            <Grid container alignItems="center">
                <Grid>
                    <Chip color="primary" size="small" label={i18next.t('filterGantt.occupationStatus')} variant="filled" />
                </Grid>
            </Grid>
            <Grid item>
                <RadioGroup sx={{ ml: '1rem' }} value={currentStatus} row onChange={(event) => handleChange(event.target.value)}>
                    {bedroomsModes.map((view) => (
                        <FormControlLabel key={view} label={i18next.t(`filterGantt.${view}`)} control={<Radio />} value={view} />
                    ))}
                </RadioGroup>
            </Grid>
        </Grid>
    );
};

export default OccupationStatusFilter;
