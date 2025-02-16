/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useState } from 'react';
import { Backdrop, Box, Fade, Grid, Modal } from '@mui/material';
import i18next from 'i18next';
import AddBedroomToCourseModal from './requestsTypes/addSoldierBedroomToCourseModal';
import AddStaffBedroomToCourseModal from './requestsTypes/addStaffBedroomToCourseModal';
import ChangeCurrentSoldiersModal from './requestsTypes/ChangeCurrentSoldiersModal';
import ChangeDatesModal from './requestsTypes/ChangeDatesModal';
import NewCourseTemplateModal from './requestsTypes/NewGeneralCourseModal';
import DeleteCourseModal from './requestsTypes/DeleteAssignedCourseModal';
import NewCourseModal from './requestsTypes/NewAssignedCourseModal';
import NewOfficeModal from './requestsTypes/NewOfficeModal';
import { RequestTypes } from '../../interfaces/request';
import NewClassModal from './requestsTypes/NewClassModal';
import { AcceptButton, CancelButton } from './Requests.styled';
import AddStaffBedroomToEventCourseModal from './requestsTypes/addStaffBedroomToEventCourseModal';
import AddBedroomToEventCourseModal from './requestsTypes/addSoldierBedroomToEventCourseModal';
import NewClassToEventModal from './requestsTypes/NewClassToEventModal';
import NewOfficeToEventModal from './requestsTypes/NewOfficeToEventModal';
import NewEventToCourseModal from './requestsTypes/NewEventToCourseModal';
import EditSoldierAmountsModal from './requestsTypes/editSoldiersAmountModal';

const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: '0px 3px 6px #00000029',
    p: 4,
    outlineStyle: 'none',
};

interface basicModalProps {
    request: any;
    open: boolean;
    handleClose: () => void;
    handleCancel?: () => void;
    handleConfirm?: () => void;
}

const BasicModal = ({ request, open, handleClose, handleCancel, handleConfirm }: basicModalProps) => {
    const [specificRequest, setSpecificRequest] = useState<any>(<div />);

    useEffect(() => {
        switch (request.type) {
            case RequestTypes.NEW_CLASS:
                setSpecificRequest(<NewClassModal request={request} />);
                break;
            case RequestTypes.NEW_OFFICE:
                setSpecificRequest(<NewOfficeModal request={request} />);
                break;
            case RequestTypes.ADD_SOLDIER_BEDROOM_TO_COURSE:
                setSpecificRequest(<AddBedroomToCourseModal request={request} />);
                break;
            case RequestTypes.ADD_STAFF_BEDROOM_TO_COURSE:
                setSpecificRequest(<AddStaffBedroomToCourseModal request={request} />);
                break;
            case RequestTypes.NEW_EVENT_RELATED_TO_COURSE:
                setSpecificRequest(<NewEventToCourseModal request={request} />);
                break;
            case RequestTypes.NEW_CLASS_TO_EVENT:
                setSpecificRequest(<NewClassToEventModal request={request} />);
                break;
            case RequestTypes.NEW_OFFICE_TO_EVENT:
                setSpecificRequest(<NewOfficeToEventModal request={request} />);
                break;
            case RequestTypes.ADD_SOLDIER_BEDROOM_TO_EVENT_TO_COURSE:
                setSpecificRequest(<AddBedroomToEventCourseModal request={request} />);
                break;
            case RequestTypes.ADD_STAFF_BEDROOM_TO_EVENT_TO_COURSE:
                setSpecificRequest(<AddStaffBedroomToEventCourseModal request={request} />);
                break;
            case RequestTypes.EDIT_SOLDIERS_AMOUNT:
                setSpecificRequest(<EditSoldierAmountsModal request={request} />);
                break;
            case RequestTypes.CHANGE_DATES:
                setSpecificRequest(<ChangeDatesModal request={request} />);
                break;
            case RequestTypes.NEW_COURSE_TEMPLATE:
                setSpecificRequest(<NewCourseTemplateModal request={request} />);
                break;
            case RequestTypes.NEW_COURSE:
                setSpecificRequest(<NewCourseModal request={request} />);
                break;
            case RequestTypes.DELETE_COURSE:
                setSpecificRequest(<DeleteCourseModal request={request} />);
                break;
            default:
                break;
        }
    }, [request]);

    return (
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
                {request && (
                    <Box sx={style}>
                        {specificRequest}
                        {handleCancel && handleConfirm && (
                            <Grid sx={{ mt: '1rem' }}>
                                <Grid container direction="row" gap={1} alignItems="center">
                                    <Grid item>
                                        <CancelButton onClick={handleCancel}>{i18next.t('requests.cancel')}</CancelButton>
                                    </Grid>
                                    <Grid item>
                                        <AcceptButton onClick={handleConfirm}>{i18next.t('requests.accept')}</AcceptButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                )}
            </Fade>
        </Modal>
    );
};

export default BasicModal;
