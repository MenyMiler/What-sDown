import { Button, ButtonProps, styled } from '@mui/material';

const baseButtonStyles = {
    width: '15%',
    height: '2.5rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '10px',
};

export const AcceptButton = styled(Button)<ButtonProps>(() => ({
    ...baseButtonStyles,
    backgroundColor: '#6ab54b',
    '&:hover': {
        backgroundColor: '#599a3f',
    },
}));

export const CancelButton = styled(Button)<ButtonProps>(() => ({
    ...baseButtonStyles,
    backgroundColor: '#e26a6a',
    '&:hover': {
        backgroundColor: '#d94040',
    },
}));
