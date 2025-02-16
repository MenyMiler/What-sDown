import { AccountCircle as MuiAccountCircle } from '@mui/icons-material';
import { Box, CSSObject, List, Drawer as MuiDrawer, Theme, styled } from '@mui/material';
import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { environment } from '../../globals';

const {
    sidebar: { drawerWidth, closedDrawerWidth },
} = environment;

const transition = (theme: Theme, property: string, duration: number, easing: string): CSSProperties => ({
    transition: theme.transitions.create(property, {
        easing,
        duration,
    }),
});

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    ...transition(theme, 'width', theme.transitions.duration.enteringScreen, theme.transitions.easing.sharp),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    ...transition(theme, 'width', theme.transitions.duration.leavingScreen, theme.transitions.easing.sharp),
    overflowX: 'hidden',
    width: closedDrawerWidth,
    [theme.breakpoints.up('sm')]: {
        width: closedDrawerWidth,
    },
});

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => {
    const mixin = open ? openedMixin(theme) : closedMixin(theme);

    return {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...mixin,
        '& .MuiDrawer-paper': mixin,
    };
});

const StyledLink = styled(Link)({
    textDecoration: 'none',
    color: 'inherit',
});

const Top = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    gap: '0.5rem',
    paddingTop: '1rem',
    paddingBottom: '0.5rem',
    background: 'linear-gradient(180deg, #5583F3, #B7CCFF)',
    borderBottomLeftRadius: '100% 90%',
    borderBottomRightRadius: '100% 90%',
});

const AccountCircle = styled(MuiAccountCircle)({
    width: '4rem',
    height: '4rem',
    color: 'white',
});

const ListsWrapper = styled(List)({
    width: '100%',
    maxWidth: drawerWidth,
    backgroundColor: 'background.paper',
    overflowY: 'auto',
    overflowX: 'hidden',
});

const Bottom = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    marginTop: '2rem',
    marginBottom: '1rem',
    height: '2.5rem',
});

export { Drawer, StyledLink, Top, AccountCircle, ListsWrapper, Bottom };
