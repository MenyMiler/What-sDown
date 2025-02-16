/* eslint-disable react/require-default-props */
import { Grid, Typography } from '@mui/material';
import React from 'react';

interface GridItemsWithGreyBackgroundProps {
    title: string;
    fullWidth?: boolean;
    children?: any[];
    child?: any;
}

const GridItemsWithGreyBackground = ({ title, fullWidth, children, child }: GridItemsWithGreyBackgroundProps) => {
    return (
        <Grid
            sx={{ width: fullWidth ? '100%' : '48%', background: '#F5F5F5', borderRadius: '1rem', pb: '1rem', ml: '0.1rem' }}
            direction="column"
            spacing={2}
            container
        >
            <Grid item>
                <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
            </Grid>
            <Grid item>
                <Grid container spacing={2}>
                    {children &&
                        children.map((other, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Grid item sx={{ width: fullWidth ? '16rem' : '8rem' }} key={index}>
                                {other}
                            </Grid>
                        ))}
                    {child && <Grid item>{child}</Grid>}
                </Grid>
            </Grid>
        </Grid>
    );
};

export { GridItemsWithGreyBackground };
