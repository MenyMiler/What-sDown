import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { Box } from '@mui/material';

interface IPiechartProps {
    free: number;
    overall: number;
    color: string;
    backgroundColor: string;
}

const Piechart = (props: IPiechartProps) => {
    const { free, overall, color, backgroundColor } = props;

    return (
        <Box style={{ width: '70%' }}>
            <PieChart
                data={[{ value: overall, key: 1, color }]}
                reveal={overall === -1 ? 0 : 100 - Number(((free / overall) * 100).toFixed(2))}
                lineWidth={12}
                background={backgroundColor}
                lengthAngle={360}
                startAngle={270}
                animationDuration={1000}
                rounded
                animate
            />
        </Box>
    );
};

export default Piechart;
