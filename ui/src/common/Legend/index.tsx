import React from 'react';
import { Box, SxProps, Typography } from '@mui/material';
import { Circle } from '@mui/icons-material';
import { Wrapper } from './Legend.styled';

interface IItem {
    dotColor: string;
    text: string;
}

interface ILegendProps {
    items: IItem[];
    spacing: 'space-between' | 'space-evenly';
    // eslint-disable-next-line react/require-default-props
    sx?: SxProps;
}

const Legend = (props: ILegendProps) => {
    const { items, spacing, sx: css = { display: 'flex', justifyContent: spacing } } = props;

    return (
        <Box sx={css}>
            {items.map((item: IItem, index: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <Wrapper key={index}>
                    <Circle sx={{ color: item.dotColor, width: '1rem' }} />
                    <Typography variant="subtitle1">{item.text}</Typography>
                </Wrapper>
            ))}
        </Box>
    );
};

export default Legend;
