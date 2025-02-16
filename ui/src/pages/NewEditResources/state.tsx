import { Chip } from '@mui/material';
import React from 'react';
import i18next from 'i18next';
import { getStateColor, StateTypes } from './chunk';

interface StateProps {
    state: StateTypes;
}

const Circle = ({ sx }: any) => (
    <span
        style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: sx.color,
            marginRight: '0.7rem',
        }}
    />
);

const State = ({ state }: StateProps) => {
    return <Chip label={i18next.t(`newEditResourcesPage.${state}`)} variant="outlined" icon={<Circle sx={{ color: getStateColor(state) }} />} />;
};

export default State;
