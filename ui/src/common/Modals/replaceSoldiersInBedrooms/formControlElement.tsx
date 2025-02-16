/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, FormControl, TextField } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect } from 'react';
import { BedroomGantt } from '../../../interfaces/roomInCourse';

interface IFormControlElementProps {
    baseId: string;
    dateFilter: {
        startDate: Date;
        endDate: Date;
    };
    handleClose: (isFirst: boolean) => void;
    onChange: (event: React.SyntheticEvent<Element, Event>, value: any, isFirst: boolean) => Promise<void>;
    bedrooms: BedroomGantt[];
    isRight: boolean;
}

const FormControlElement = ({ baseId, dateFilter, handleClose, onChange, bedrooms, isRight }: IFormControlElementProps) => {
    const [inputValue, setInputValue] = React.useState<{
        label: string;
        id: string;
    } | null>(null);

    useEffect(() => {
        setInputValue(null);
    }, [baseId, dateFilter]);

    return (
        <FormControl sx={{ marginLeft: isRight ? '3%' : '17%' }}>
            <Autocomplete
                value={inputValue}
                disablePortal
                isOptionEqualToValue={(option, value) => option.id === value.id}
                id="combo-box-demo"
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.label}
                    </li>
                )}
                options={bedrooms.map((bedroom) => ({
                    label: `${bedroom.location.buildingName} | ${bedroom.name}`,
                    id: bedroom._id,
                }))}
                sx={{ width: 211 }}
                onChange={(e, value) => {
                    value ?? handleClose(isRight);
                    onChange(e, value, isRight);
                    setInputValue(value);
                }}
                renderInput={(params) => <TextField {...params} label={i18next.t('wizard.replaceSoldiersInBedrooms.bedrooms')} />}
            />
        </FormControl>
    );
};

export default FormControlElement;
