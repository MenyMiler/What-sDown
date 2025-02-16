/* eslint-disable react/require-default-props */
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import i18next from 'i18next';
import React, { useState } from 'react';

interface multipleSortProps {
    sortOptions: { _id: string; name: string }[];
    handleSort: (ids: string[]) => void;
    label: string;
}

export const MultipleSort = ({ sortOptions, handleSort, label }: multipleSortProps) => {
    const ALL_OPTION = i18next.t('all');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([ALL_OPTION]);

    const handleChange = ({ target: { value } }: SelectChangeEvent<string>) => {
        if (!value.length) {
            setSelectedOptions([ALL_OPTION]);
            handleSort([]);
            return;
        }
        const currentOptions = [value].flat();
        const filteredOptions = currentOptions.filter((option) => option !== i18next.t('all'));
        // Extract the options in the form of { _id, name } of the selected options from the input (by name)
        const mappedOptions: { _id: string; name: string }[] = filteredOptions
            .map((option) => sortOptions.find(({ name }) => option === name)!)
            .filter((option) => !!option);
        const mappedOptionsNames = mappedOptions.map(({ name }) => name);
        const mappedOptionsIds = mappedOptions.map(({ _id }) => _id);
        setSelectedOptions(mappedOptionsNames);
        handleSort(mappedOptionsIds);
    };

    const isSelected = (name: string) => selectedOptions.some((option) => option === name);

    return (
        <FormControl sx={{ width: 90, m: 1 }}>
            <InputLabel id="label">{label}</InputLabel>
            <Select
                label={label}
                multiple
                sx={{ height: '2.5rem' }}
                value={selectedOptions as any as string}
                renderValue={(selected) => (Array.isArray(selected) ? (selected as string[]).join(', ') : selected)}
                onChange={handleChange}
                MenuProps={{ PaperProps: { sx: { maxHeight: '30rem' } } }}
            >
                {sortOptions.map(({ name }) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={isSelected(name)} />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
