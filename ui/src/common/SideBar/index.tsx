/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useEffect, useState } from 'react';
// import { Brightness4, Brightness7 } from '@mui/icons-material';
import { CacheProvider } from '@emotion/react';
import { Chat, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import { Button, Grid, IconButton, Typography, useTheme } from '@mui/material';
import i18next from 'i18next';
import { useNavigate } from 'react-router';
import { cacheRtl } from '../../Main';
import { environment } from '../../globals';
import { useUserStore } from '../../stores/user';
import { Greeting } from '../Greeting';
import ModalListItem from '../Modals';
import SendFeedbackModal from '../Modals/sendFeedback';
import ChangeBase from '../changeBase';
import SidebarLists from './Lists';
import { Bottom, Drawer, StyledLink, Top } from './SideBar.styled';

const {
    sidebar: { openSidebarWidth, closedSidebarWidth },
} = environment;

export const OpenContext = createContext<boolean>(true);

const SideBar = () => {
    const currentUser = useUserStore(({ user }) => user);

    const [selectedListItem, setSelectedListItem] = useState<number>(0);
    const [logoWidth, setLogoWidth] = useState(openSidebarWidth);
    const [open, setOpen] = React.useState(true);

    const handleDrawer = (isOpen: boolean, width: number) => {
        setLogoWidth(width);
        setOpen(isOpen);
    };

    const handleDrawerOpen = () => handleDrawer(true, openSidebarWidth);

    const handleDrawerClose = () => handleDrawer(false, closedSidebarWidth);

    const [sideBarRenderSwitch, setSideBarRenderSwitch] = useState(false);
    const [currTextIdentifier, setCurrTextIdentifier] = useState('');

    const handleOnClickEvent = () => setSideBarRenderSwitch(!sideBarRenderSwitch);

    return (
        <Drawer variant="permanent" open={open} anchor="right">
            <CacheProvider value={cacheRtl}>
                <Top>
                    <StyledLink to="/" onClick={handleOnClickEvent} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Grid container spacing={1}>
                            {open && (
                                <Grid item sx={{ width: '100%' }} xs={8}>
                                    <Typography color="white" sx={{ fontSize: '2.5rem' }}>
                                        FullPlan
                                    </Typography>
                                </Grid>
                            )}
                            <Grid item sx={{ width: '100%' }} xs={4}>
                                <img
                                    src="images/logo.svg"
                                    alt=""
                                    style={{ width: `${logoWidth}rem`, color: 'white', fontSize: '4rem', marginLeft: '.3rem' }}
                                />
                            </Grid>
                        </Grid>
                    </StyledLink>
                    {open && (
                        <>
                            <ChangeBase />
                            <Greeting name={currentUser.name!} />
                        </>
                    )}
                </Top>
                <OpenContext.Provider value={open}>
                    <Grid container justifyContent="space-between" sx={{ height: '100%', overflowY: 'auto' }}>
                        <Grid item sx={{ width: '100%' }}>
                            <SidebarLists
                                handleDrawerOpen={handleDrawerOpen}
                                handleOnClickEvent={handleOnClickEvent}
                                currTextIdentifier={currTextIdentifier}
                                setCurrTextIdentifier={setCurrTextIdentifier}
                                sideBarRenderSwitch={sideBarRenderSwitch}
                            />
                        </Grid>
                        <Grid item sx={{ width: '100%', alignSelf: 'flex-end' }}>
                            <ModalListItem
                                Icon={Chat}
                                text={i18next.t('feedback.title')}
                                ModalContent={SendFeedbackModal}
                                setCurrTextIdentifier={setCurrTextIdentifier}
                                currTextIdentifier={currTextIdentifier}
                                sideBarRenderSwitch={sideBarRenderSwitch}
                            />
                        </Grid>
                    </Grid>
                </OpenContext.Provider>
                <Bottom>
                    {open ? (
                        <Button sx={{ width: '8rem', color: '#2c2e39', marginRight: '2rem' }} onClick={handleDrawerClose}>
                            <KeyboardDoubleArrowRight sx={{ marginRight: '1rem', color: '#757575' }} />
                            {i18next.t('sideBar.close')}
                        </Button>
                    ) : (
                        <IconButton onClick={handleDrawerOpen}>
                            <KeyboardDoubleArrowLeft />
                        </IconButton>
                    )}
                </Bottom>
            </CacheProvider>
        </Drawer>
    );
};

export { SideBar };
