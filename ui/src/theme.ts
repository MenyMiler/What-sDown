import { createTheme, PaletteMode } from '@mui/material';
import { environment } from './globals';

export const globalTheme = (mode: PaletteMode) =>
    createTheme({
        palette: {
            mode,
            ...environment.colors,
        },
        typography: {
            fontFamily: 'Assistant,sans-serif',
            fontSize: 16,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    '::-webkit-scrollbar': { width: '10px', height: '10px' },
                    '::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '10px' },
                    '::-webkit-scrollbar-thumb': { background: '#CFCECE', borderRadius: '10px' },
                    '::-webkit-scrollbar-thumb:hover ': { background: '#a8a8a8' },
                },
            },
        },
    });
