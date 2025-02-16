/* eslint-disable react/require-default-props */
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import i18next from 'i18next';
import React, { useState } from 'react';
import { ViewMode } from '../ganttTask';
import { BedroomModes } from '../ganttTask/types/public-types';

interface IChangeViewModeButtonProps {
    setViewMode: (newVal: any) => void;
    isBedroomFilter?: boolean;
}

const viewableModes = [ViewMode.Day, ViewMode.Week];
const bedroomsModes = [...Object.values(BedroomModes)];

export const ChangeViewModeButton = ({ setViewMode, isBedroomFilter }: IChangeViewModeButtonProps) => {
    const [alignment, setAlignment] = useState<ViewMode | BedroomModes>(isBedroomFilter ? BedroomModes.All : ViewMode.Week);

    const handleChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: ViewMode | BedroomModes) => {
        if (!newAlignment) return;
        setAlignment(newAlignment);
        setViewMode(newAlignment);
    };

    const getToggleButton = (viewMode: ViewMode | BedroomModes) => (
        <ToggleButton key={viewMode} value={viewMode}>
            {i18next.t(`filterGantt.${viewMode}`)}
        </ToggleButton>
    );

    return (
        <ToggleButtonGroup value={alignment} exclusive onChange={handleChange} size="small" sx={{ bgcolor: 'white', mr: '1rem' }}>
            {isBedroomFilter ? bedroomsModes.map(getToggleButton) : viewableModes.map(getToggleButton)}
        </ToggleButtonGroup>
    );
};
