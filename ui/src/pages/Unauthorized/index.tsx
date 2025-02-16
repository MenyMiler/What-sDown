import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import i18next from 'i18next';
import './style.css';
import AuthorizationModal from './AuthorizationModal';
import { useUserStore } from '../../stores/user';

const Unauthorized = () => {
    const currentUser = useUserStore(({ user }) => user);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!currentUser.currentUserType) return;

        navigate('/');
    }, [currentUser.baseId]);

    return (
        <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center" marginTop="8rem" dir="ltr">
            <AuthorizationModal open={open} handleClose={() => setOpen(false)} />
            <Grid item>
                <Typography fontSize="4rem">
                    {i18next.t(`unauthorized.${currentUser.currentUserType ? 'title' : 'noPermissionsToSystemTitle'}`)}
                </Typography>
            </Grid>
            <Grid item>
                <Typography fontSize="1.5rem">
                    {i18next.t(`unauthorized.${currentUser.currentUserType ? 'description' : 'noPermissionsToSystemDescription'}`)}
                </Typography>
            </Grid>
            {!currentUser.currentUserType && (
                <Grid item>
                    <Button size="large" onClick={() => setOpen(true)}>
                        {i18next.t('unauthorized.authorizedButtonDescription')}
                    </Button>
                </Grid>
            )}
            <Grid item>
                <div className="hover">
                    <div className="background" style={{ left: currentUser.currentUserType ? '42%' : '50%' }}>
                        <div className="door">403</div>
                        <div className="rug" />
                    </div>
                    <div className="foreground" style={{ left: currentUser.currentUserType ? '42%' : '50%' }}>
                        <div className="bouncer">
                            <div className="head">
                                <div className="neck" />
                                <div className="eye left" />
                                <div className="eye right" />
                                <div className="ear" />
                            </div>
                            <div className="body" />
                            <div className="arm" />
                        </div>
                        <div className="poles">
                            <div className="pole left" />
                            <div className="pole right" />
                            <div className="rope" />
                        </div>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};

export default Unauthorized;
