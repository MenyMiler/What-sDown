/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import { Box } from '@mui/material';
import React from 'react';

interface TabPanelProps {
    index: number;
    value: number;
    children?: React.ReactNode;
}

export const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
    <div role="tabpanel" hidden={value !== index} {...other}>
        {value === index && <Box sx={{ pt: 3, height: '100%' }}>{children}</Box>}
    </div>
);
