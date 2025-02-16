/* eslint-disable react/jsx-props-no-spreading */
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import React, { useState } from 'react';
import BaseListItem, { IBaseListItemProps } from '../SideBar/Lists/List/BaseListItem';
import GenericModalForm, { IModalContent } from './GenericModalForm';

const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: '0px 3px 6px #00000029',
    p: 4,
    outlineStyle: 'none',
};

interface IModalButtonProps extends IBaseListItemProps {
    ModalContent: IModalContent;
    currTextIdentifier: string;
    setCurrTextIdentifier: React.Dispatch<React.SetStateAction<string>>;
    sideBarRenderSwitch: boolean;
}

const ModalListItem = (props: IModalButtonProps) => {
    const { Icon, text, ModalContent, currTextIdentifier, setCurrTextIdentifier, sideBarRenderSwitch } = props;
    const [open, setOpen] = useState(false);

    const handleOpen = (textIdentifier: string) => {
        setCurrTextIdentifier(textIdentifier);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setCurrTextIdentifier('');
    };

    return (
        <div>
            <BaseListItem
                Icon={Icon}
                text={text}
                onClick={handleOpen}
                selected={open}
                sideBarRenderSwitch={sideBarRenderSwitch}
                currTextIdentifier={currTextIdentifier}
            />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <GenericModalForm handleClose={handleClose} {...ModalContent} />
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};

export default ModalListItem;
