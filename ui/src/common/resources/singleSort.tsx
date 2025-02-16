import { InputLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import i18next from 'i18next';
import React, { useState } from 'react';

interface singleSortProps {
    sortOptions: { _id: string; name: string }[];
    handleSort: (id: string | undefined) => void;
    label: string;
}

const SingleSort = ({ sortOptions, handleSort, label }: singleSortProps) => {
    const ALL_OPTION = 'ALL';
    const [sortSelection, setSortSelection] = useState<string>(ALL_OPTION);

    const handleChange = ({ target: { value } }: SelectChangeEvent) => {
        setSortSelection(value);
        handleSort(value === ALL_OPTION ? undefined : value);
    };

    return (
        <FormControl sx={{ m: 1, width: 90 }}>
            <InputLabel id="select">{label}</InputLabel>
            <Select
                labelId="select"
                label={label}
                inputProps={{ 'aria-label': 'Without label' }}
                value={sortSelection}
                sx={{ height: '2.5rem' }}
                onChange={handleChange}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 48 * 4.5 + 8,
                        },
                    },
                }}
            >
                <MenuItem key={ALL_OPTION} value={ALL_OPTION}>
                    <em>{i18next.t('all')}</em>
                </MenuItem>
                {sortOptions.map(({ _id, name }) => (
                    <MenuItem key={_id} value={_id}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SingleSort;
