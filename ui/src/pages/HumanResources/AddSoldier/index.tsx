/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { Add } from '@mui/icons-material';
import { Box, Fade, IconButton, Modal } from '@mui/material';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import GenericModalForm from '../../../common/Modals/GenericModalForm';
import { SoldierTypes } from '../../../interfaces/soldier';
import addToCourseModal from './createSoldierModal';

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

interface IAddSoldierProps {
    soldierType: SoldierTypes;
    disabled: boolean;
    reloadSoldiers: () => void;
}

const AddSoldier = ({ soldierType, disabled, reloadSoldiers }: IAddSoldierProps) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        reloadSoldiers();
        setOpen(false);
    };

    const { watch } = useFormContext();
    const courseId = watch('courseId');

    return (
        <>
            <IconButton sx={{ padding: 0 }} disabled={disabled} onClick={handleOpen}>
                <Add fontSize="large" />
            </IconButton>
            {open && (
                <Modal open={open} onClose={handleClose} closeAfterTransition>
                    <Fade in={open}>
                        <Box sx={style}>
                            <GenericModalForm
                                handleClose={handleClose}
                                {...(soldierType === SoldierTypes.STUDENT ? addToCourseModal(courseId, false) : addToCourseModal(courseId, true))}
                            />
                        </Box>
                    </Fade>
                </Modal>
            )}
        </>
    );
};
export default AddSoldier;
