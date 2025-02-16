/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DatePickerField from '../DatePicker';
import { ViewMode } from '../ganttTask';
import { Filter } from '../../utils/filter';

const millisecondsInOneDay = 24 * 60 * 60 * 1000;

interface ISortDateProps {
    filter?: Filter;
    setFilter: (filterBy: any) => void;
    hasEndDate?: boolean;
    defaultRangeInDays?: number;
    size?: string;
}

export const SortDate = ({ filter, setFilter, hasEndDate, size, defaultRangeInDays }: ISortDateProps) => {
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
        hasEndDate ? (defaultRangeInDays ? new Date(new Date().getTime() + defaultRangeInDays * millisecondsInOneDay) : new Date()) : null,
    );

    useEffect(() => {
        const dateFilter: { startDate?: Date; endDate?: Date } = {};

        if (selectedStartDate) dateFilter.startDate = selectedStartDate;
        if (selectedEndDate) dateFilter.endDate = selectedEndDate;

        setFilter((filterBy: any) => ({ ...filterBy, ...dateFilter }));
    }, [selectedStartDate, selectedEndDate]);

    useEffect(() => {
        if (selectedStartDate && filter?.viewMode) {
            switch (filter.viewMode) {
                case ViewMode.Day:
                    setSelectedEndDate(new Date(selectedStartDate.getTime() + 24 * 60 * 60 * 1000));
                    break;
                case ViewMode.Week:
                    setSelectedEndDate(new Date(selectedStartDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                    break;
                case ViewMode.TwoWeek:
                    setSelectedEndDate(new Date(selectedStartDate.getTime() + 14 * 24 * 60 * 60 * 1000));
                    break;
                default:
                    setSelectedEndDate(new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth() + 1, selectedStartDate.getDate()));
                    break;
            }
        }
    }, [selectedStartDate]);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mt: 1, mb: 1, mr: 1, minWidth: 210, backgroundColor: 'white' }}>
                <DatePickerField sx={{ width: size }} date={selectedStartDate} setDate={setSelectedStartDate} />
            </Box>
        </Box>
    );
};
