/* eslint-disable react/require-default-props */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import i18next from 'i18next';
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

interface singleSortProps {
    sortOption: string[] | undefined;
    handleSort: (sort: string) => any;
    label: string;
    pageType?: string;
    flag?: boolean;
    autoComplete?: boolean;
    customWidth?: string;
}

const SingleSort = ({ sortOption, handleSort, label, pageType, flag, autoComplete, customWidth }: singleSortProps) => {
    const [sort, setSort] = useState<string>('');

    const handleChange = (event: SelectChangeEvent) => {
        setSort(event.target.value);
        handleSort(event.target.value);
    };

    const translate = (sortLabel: string, singleSortOption: string) => {
        if (singleSortOption === 'all') return i18next.t(singleSortOption);
        switch (sortLabel) {
            case 'all':
                return i18next.t('all');
            case 'type':
                return i18next.t(`common.types.${singleSortOption}`);
            case 'staff':
                return i18next.t(`isStaff.${singleSortOption}`);
            case 'gender':
                return i18next.t(`common.genders.${singleSortOption}`);
            case 'month':
                return i18next.t(`months.${singleSortOption}`);
            default:
                return singleSortOption;
        }
    };

    useEffect(() => {
        setSort('all');
    }, [pageType, flag]);

    return (
        <FormControl sx={{ m: 1, width: customWidth || 210, backgroundColor: 'white' }}>
            {autoComplete ? (
                <Autocomplete
                    id="combo-box-demo"
                    options={sortOption!.map((singleSortOption) => ({ key: singleSortOption, value: translate(label, singleSortOption) }))}
                    getOptionLabel={(option) => option.value || ''}
                    onChange={(_event: any, newValue: { key: string; value: string } | null) => {
                        setSort(newValue!.key);
                        handleSort(newValue!.key);
                    }}
                    value={{ key: sort, value: translate(label, sort) }}
                    disableClearable
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    renderInput={(params) => <TextField {...params} label={i18next.t(`filterGantt.${label}`)} />}
                />
            ) : (
                <>
                    <InputLabel id="label">{i18next.t(`filterGantt.${label}`)}</InputLabel>
                    <Select labelId="label" label={i18next.t(`filterGantt.${label}`)} value={sort} onChange={handleChange} autoWidth>
                        {sortOption &&
                            sortOption.map((singleSortOption, index) => {
                                return (
                                    <MenuItem key={index.toString() as string} value={singleSortOption} sx={{ minWidth: customWidth || 210 }}>
                                        {translate(label, singleSortOption)}
                                    </MenuItem>
                                );
                            })}
                    </Select>
                </>
            )}
        </FormControl>
    );
};

export { SingleSort };
