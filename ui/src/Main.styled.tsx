import { Box, styled } from '@mui/material';
import { ReactComponent as School } from './svgs/school.svg';
import { ReactComponent as Yesodot } from './svgs/yesodot.svg';

const MainBox = styled(Box)(({ theme }) => ({
    backgroundImage: theme.palette.mode === 'light' ? 'linear-gradient(25deg, #b7d5f7, #ece4fe, #f8f9fe)' : 'linear-gradient(0deg, #212121, #212121)',
    flexGrow: 1,
    overflow: 'auto',
    maxHeight: '100vh',
    height: '100vh',
}));

const StyledYesodotIcon = styled(Yesodot)({ position: 'absolute', right: 0, height: '3rem', width: '3rem' });
const StyledSchoolIcon = styled(School)({ position: 'absolute', right: '50px', height: '2.4rem', width: '3rem', top: '4px' });

export { MainBox, StyledYesodotIcon, StyledSchoolIcon };
