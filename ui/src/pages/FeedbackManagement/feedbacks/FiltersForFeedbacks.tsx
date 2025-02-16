import { Search } from '@mui/icons-material';
import { Box, Grid, InputAdornment, TextField } from '@mui/material';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import DatePickerField from '../../../common/DatePicker';

interface IFiltersForFeedbacksProps {
    setFilters: (value: object) => void;
    filters: Object;
}

export const FiltersForFeedbacks = ({ setFilters, filters }: IFiltersForFeedbacksProps) => {
    const [selectedStartDate, setSelectedStartDate] = useState<any>(undefined);
    const [selectedEndDate, setSelectedEndDate] = useState<any>(undefined);

    const filterByName = (filterString: string) => {
        setFilters({ ...filters, name: filterString, populate: true });
    };

    useEffect(() => {
        const filter: { startDate?: Date; endDate?: Date } = {};

        if (selectedStartDate) filter.startDate = selectedStartDate;
        if (selectedEndDate) filter.endDate = selectedEndDate;
        if (selectedEndDate && !selectedStartDate) {
            filter.startDate = new Date();
            setSelectedStartDate(new Date());
        }
        if (!selectedEndDate && selectedStartDate) {
            filter.endDate = new Date();
            setSelectedEndDate(new Date());
        }

        setFilters({ ...filters, ...filter });
    }, [selectedStartDate, selectedEndDate]);

    return (
        <Grid item container spacing={1.5} direction="row-reverse" alignItems="center">
            <Grid item>
                <TextField
                    onChange={_.debounce((e) => filterByName(e.target.value), 500)}
                    InputProps={{
                        sx: { width: '20rem', backgroundColor: 'white' },
                        placeholder: `${i18next.t('feedbackManagementPage.search')}`,
                        size: 'small',
                        endAdornment: (
                            <InputAdornment position="start" sx={{ mr: '1.5px' }}>
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item>
                <Box sx={{ minWidth: 210, backgroundColor: 'white' }}>
                    <DatePickerField date={selectedEndDate < selectedStartDate ? selectedStartDate : selectedEndDate} setDate={setSelectedEndDate} />
                </Box>
            </Grid>
            <Grid item>
                <Box sx={{ minWidth: 210, backgroundColor: 'white' }}>
                    <DatePickerField date={selectedStartDate} setDate={setSelectedStartDate} />
                </Box>
            </Grid>
        </Grid>
    );
};
