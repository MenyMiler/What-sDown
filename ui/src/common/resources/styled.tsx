import { Box, Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainCardStyled = styled(Card)(() => ({
    border: '1px solid #CFCFCF',
    display: 'flex',
    width: '100%',
    borderRadius: '10px',
    height: '100%',
}));

export const FullCardStyled = styled(Card)(() => ({
    border: '1px solid #CFCFCF',
    display: 'flex',
    width: '100%',
    borderRadius: '10px',
    height: '15.5rem',
    overflowX: 'auto',
    paddingTop: '1rem',
}));

export const StyledBox = styled(Box)(() => ({
    padding: '1rem',
    width: '25%',
}));

export const StyledLoader = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'center',
}));

export const StyledTypography = styled(Typography)(() => ({
    fontSize: '0.875rem',
    fontWeight: 'bold',
}));
