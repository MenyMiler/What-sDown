import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAutoCompleteOptions } from '.';
import { Resource } from '../..';

interface INumberInputProps {
    tag?: IAutoCompleteOptions; // eslint-disable-line react/require-default-props
    populatedFieldName: string;
    propertyName: string;
}

export const NumberInput = ({ tag, populatedFieldName, propertyName }: INumberInputProps) => {
    const { setValue, watch } = useFormContext();

    const fieldValue = watch(populatedFieldName) as Resource[];

    const amount = useMemo(() => fieldValue.find(({ _id }) => _id === tag?._id)?.amount ?? 1, [fieldValue]);

    const handleChange = (newValue: number) => {
        if (!fieldValue) return;

        const changedIndex = fieldValue.findIndex(({ _id }) => _id === tag?._id);
        if (changedIndex === -1) return;

        fieldValue[changedIndex] = { ...fieldValue[changedIndex], amount: newValue };

        setValue(populatedFieldName, fieldValue);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Typography variant="body1">{tag?.label ?? tag?.[propertyName]}</Typography>
            <Box display="flex" justifyContent="center" alignItems="center">
                <IconButton onClick={() => handleChange(amount + 1)}>
                    <ArrowUpward />
                </IconButton>
                <Typography>{amount}</Typography>
                <IconButton
                    onClick={() => {
                        if (amount <= 1) return;
                        handleChange(amount - 1);
                    }}
                    disabled={amount <= 1}
                >
                    <ArrowDownward />
                </IconButton>
            </Box>
        </Box>
    );
};
