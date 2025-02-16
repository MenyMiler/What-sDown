import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { environment } from '../../globals';

const { colors } = environment;

export const DailyButton = styled(Box)({
    padding: '0.2rem 1.2rem',
    border: `0.063rem solid ${colors.button.errorSecondary}`,
    borderRadius: '5px',
    opacity: 1,
    background: colors.button.errorPrimary,
    fontWeight: 'bold',
    fontSize: '1rem',
    color: colors.button.errorSecondary,
});
