import { Autocomplete, TextField } from '@mui/material';
import i18next from 'i18next';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { SoldierDocument } from '../../../interfaces/soldier';
import { CoursesService } from '../../../services/courses';

interface ISoldierFilterProps {
    setFilter: (newValue: any) => void;
    currentSoldier: string | null | undefined;
    coursesIds: string[];
}

const SoldiersFilter = ({ coursesIds, setFilter }: ISoldierFilterProps) => {
    const [soldiers, setSoldiers] = useState<SoldierDocument[]>([]);

    const handleChange = (newValue: string | null) => {
        setFilter((curr: {}) => ({ ...curr, ...{ soldierId: newValue || undefined } }));
    };

    useEffect(() => {
        const getSoldiersNames = async () => {
            const result = await CoursesService.getSoldiersByCoursesIds(coursesIds);
            setSoldiers(result);
        };
        if (coursesIds.length) getSoldiersNames();
        else handleChange(null);
    }, [coursesIds]);

    return (
        <Autocomplete
            options={soldiers.map(({ name, _id }) => ({ key: _id, value: name }))}
            sx={{ width: '15rem', backgroundColor: 'white', margin: '0.5%' }}
            getOptionLabel={(option) => option.value || ''}
            onChange={(_event: any, newValue: { key: string; value: string } | null) => handleChange(newValue ? newValue.key : '')}
            // eslint-disable-next-line react/jsx-props-no-spreading
            renderInput={(params) => <TextField {...params} label={i18next.t('filterGantt.soldierName')} />}
            size="small"
        />
    );
};

export default SoldiersFilter;
