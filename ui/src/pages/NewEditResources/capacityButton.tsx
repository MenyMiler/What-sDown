/* eslint-disable react/require-default-props */
import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

interface CapacityButtonProps {
    setValue: (curr: number) => void;
    value: number;
    max: number;
    min?: number;
}

const CapacityButton = ({ setValue, value, max, min = 0 }: CapacityButtonProps) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            border="1px solid #e0e0e0"
            borderRadius="1rem"
            padding="2px 4px"
            bgcolor="#f9f9f9"
            width="120px"
        >
            <IconButton
                size="small"
                onClick={() => setValue(Math.min(value + 1, max))}
                disabled={value >= max}
                style={{
                    color: value >= max ? '#c0c0c0' : '#000',
                }}
            >
                <Add />
            </IconButton>
            <Box component="span" textAlign="center" flex="1" fontSize="18px" color="#000">
                {value}
            </Box>
            <IconButton
                size="small"
                onClick={() => setValue(Math.max(value - 1, min))}
                disabled={value <= min}
                style={{
                    color: value <= min ? '#c0c0c0' : '#000',
                }}
            >
                <Remove />
            </IconButton>
        </Box>
    );
};

export default CapacityButton;
