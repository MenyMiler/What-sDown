/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import i18next from 'i18next';

interface IBedroomCubeInfoProps {
    open: boolean;
    handleClose: () => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BedroomCubeInfo = (props: IBedroomCubeInfoProps) => {
    const { open, handleClose } = props;
    return (
        <div>
            <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
                <DialogTitle>{i18next.t('bedroomsGantt.info')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{`${i18next.t('bedroomsGantt.maxCapacity')}/${i18next.t('bedroomsGantt.occupation')} (${i18next.t(
                        'bedroomsGantt.soldiers',
                    )})`}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{i18next.t('editUser.okButton')}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BedroomCubeInfo;
