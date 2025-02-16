/* eslint-disable jsx-a11y/anchor-is-valid */
import { Chip, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import i18next from 'i18next';
import * as React from 'react';
import { ViewMode } from '../../ganttTask/types/public-types';

interface IViewModeFilterProps {
    setFilter: (newValue: any) => void;
    currentViewMode: string;
}

const ViewModeFilter = ({ setFilter, currentViewMode }: IViewModeFilterProps) => {
    const viewableModes = [ViewMode.Day, ViewMode.Week, ViewMode.TwoWeek, ViewMode.Month];

    const handleChange = (newValue: string) => setFilter((curr: {}) => ({ ...curr, ...{ viewMode: newValue } }));

    return (
        <Grid container>
            <Grid container alignItems="center">
                <Grid>
                    <Chip color="primary" size="small" label={i18next.t('filterGantt.viewModes')} variant="filled" />
                </Grid>
            </Grid>
            <Grid item>
                <RadioGroup sx={{ ml: '1rem' }} value={currentViewMode} row onChange={(event) => handleChange(event.target.value)}>
                    {viewableModes.map((view) => (
                        <FormControlLabel key={view} label={i18next.t(`filterGantt.${view}`)} control={<Radio />} value={view} />
                    ))}
                </RadioGroup>
            </Grid>
        </Grid>
    );
};

export default ViewModeFilter;
