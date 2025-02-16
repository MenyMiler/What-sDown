/* eslint-disable jsx-a11y/anchor-is-valid */
import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import i18next from 'i18next';
import * as React from 'react';
import { useEffect, useState } from 'react';
import FilterTitle from '../filterTitle';

interface IRoomTypeFilter {
    setFilter: (newValue: any) => void;
    currentRoomType: string | null;
}

const RoomTypeFilter = ({ setFilter, currentRoomType }: IRoomTypeFilter) => {
    const roomTypes = ['true', 'false'];
    const [selectedType, setSelectedType] = useState<string | null>(currentRoomType);

    const handleChange = (newValue: string | null) => {
        setFilter((curr: {}) => ({ ...curr, ...{ isStaff: newValue ?? undefined } }));
        setSelectedType(newValue);
    };

    useEffect(() => setSelectedType(currentRoomType), [currentRoomType]);

    return (
        <Grid container>
            <FilterTitle disabled={!selectedType} resetFilter={() => handleChange(null)} title="filterGantt.staff" />

            <Grid item>
                <RadioGroup sx={{ ml: '1rem' }} value={selectedType} row onChange={(event) => handleChange(event.target.value)}>
                    {roomTypes.map((roomType) => (
                        <FormControlLabel key={roomType} label={i18next.t(`isStaff.${roomType}`)} control={<Radio />} value={roomType} />
                    ))}
                </RadioGroup>
            </Grid>
        </Grid>
    );
};

export default RoomTypeFilter;
