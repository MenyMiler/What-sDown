import { styled, Card, Typography, Button } from '@mui/material';

const RequestsCard = styled(Card)({
    height: '100%',
    maxHeight: '24.5rem',
    borderRadius: '0.625rem',
});

const Header = styled(Typography)({
    fontWeight: 'bold',
    fontSize: '1.25rem',
});

const CancelButton = styled(Button)({
    padding: '0.2rem 0.6rem',
    border: '0.063rem solid #cb0000',
    borderRadius: '0.3rem',
    opacity: 1,
    background: '#ffffff',
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#cb0000',
});

const AcceptButton = styled(Button)({
    padding: '0.2rem 0.6rem',
    border: '0.063rem solid #009c00',
    borderRadius: '0.3rem',
    opacity: 1,
    background: '#ffffff',
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#009c00',
});

export { RequestsCard, Header, AcceptButton, CancelButton };
