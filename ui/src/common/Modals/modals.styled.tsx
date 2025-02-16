import { Box, Button, Grid, styled } from '@mui/material';

export const ContentWrap = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
});

export const ButtonWrap = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    gap: '50%',
    marginTop: '3rem',
});

export const BaseButton = styled(Button)({
    borderRadius: '0.5rem',
    background: 'linear-gradient(90deg, #63A3FB, #6988F4)',
    color: 'white',
    width: '9rem',
    height: '3rem',
});

export const BackButton = styled(BaseButton)({
    marginRight: 1,
    ':disabled': {
        background: 'rgba(0, 0, 0, 0.26)',
    },
});

export const GridWrapper = styled(Grid)({
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: '3rem',
});

export const GridWithMultipleItems = styled(Grid)({
    alignItems: 'stretch',
    justifyContent: 'space-between',
    wrap: 'nowrap',
});

// export const GridWithGreyBackground = styled(Grid)({
//     alignItems: 'stretch',
//     justifyContent: 'space-between',
//     wrap: 'nowrap',
//     background: '#E3E3E3',
// });
