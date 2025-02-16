import { styled, Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import React from 'react';

interface IPageProps {
    title: string;
    children: any;
    // eslint-disable-next-line react/require-default-props
    autoMargin?: any;
}

const StyledGrid = styled(Grid)({ marginTop: '3rem' });
const StyledDiv = styled('div')({ width: '100%' });

const PageTemplate = (props: IPageProps) => {
    const { title, children, autoMargin = '4rem' } = props;
    return (
        <StyledGrid container direction="column" alignItems="flex-start">
            <Typography sx={{ fontWeight: 'bold' }} variant="h5">
                {i18next.t(title)}
            </Typography>
            <StyledDiv style={{ marginTop: autoMargin }}>{children}</StyledDiv>
        </StyledGrid>
    );
};

export { PageTemplate };
