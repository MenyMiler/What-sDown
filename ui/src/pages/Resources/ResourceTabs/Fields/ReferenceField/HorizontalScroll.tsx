import { Chip, Grid } from '@mui/material';
import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { Resource } from '../..';

interface HorizontalScrollProps {
    items: Resource[];
    propertyName: string;
}

export const HorizontalScroll = ({ items, propertyName }: HorizontalScrollProps) => (
    <ScrollContainer horizontal vertical={false}>
        <Grid container spacing={1} wrap="nowrap">
            {items.map((item) => (
                <Grid item key={item._id}>
                    <Chip label={item[propertyName]} />
                </Grid>
            ))}
        </Grid>
    </ScrollContainer>
);
