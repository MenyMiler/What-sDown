import { Card } from '@mui/material';
import React from 'react';
import { RoomTypes } from '../../interfaces/room';
import SingleCube from './singleCube';
import SingleCubeWithPieChart from './singleCubeWithPieChart';

const TopBarGeneralStatistics = () => {
    return (
        <Card
            sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                gap: '2rem',
                borderRadius: '0.625rem',
                py: '1rem',
            }}
        >
            <SingleCubeWithPieChart type={RoomTypes.CLASS} />
            <SingleCubeWithPieChart type={RoomTypes.OFFICE} />
            <SingleCubeWithPieChart type={RoomTypes.BEDROOM} />
            <SingleCube type="soldiers" />
            <SingleCube type="courses" />
        </Card>
    );
};

export default TopBarGeneralStatistics;
