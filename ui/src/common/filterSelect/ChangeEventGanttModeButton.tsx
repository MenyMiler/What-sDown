/* eslint-disable react/require-default-props */
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import i18next from 'i18next';
import React, { useState } from 'react';

interface ChangeEventGanttModeButtonProps {
    setMode: (newVal: any) => void;
}

export const ChangeEventGanttModeButton = ({ setMode }: ChangeEventGanttModeButtonProps) => {
    const [alignment, setAlignment] = useState<boolean | string>('all');

    const handleChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: boolean | string) => {
        if (newAlignment === null) return;
        setAlignment(newAlignment);
        setMode(newAlignment);
    };

    const getToggleButton = (ganttMode: boolean | string) => (
        <ToggleButton key={`${ganttMode}`} value={ganttMode}>
            {i18next.t(`eventsGantt.${ganttMode}`)}
        </ToggleButton>
    );

    return (
        <ToggleButtonGroup value={alignment} exclusive onChange={handleChange} size="small" sx={{ bgcolor: 'white', mr: '1rem' }}>
            {['all', true, false].map(getToggleButton)}
        </ToggleButtonGroup>
    );
};
