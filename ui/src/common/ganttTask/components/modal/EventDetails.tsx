/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
import { ArrowBackIos, ArrowForwardIos, CancelOutlined } from '@mui/icons-material';
import { Backdrop, Box, Button, Fade, Grid, Modal, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
import { environment } from '../../../../globals';
import { PopulatedEvent } from '../../../../interfaces/event';
// import { RequestTypes } from '../../../../interfaces/request';
import { RoomTypes, RoomWithSoldiers } from '../../../../interfaces/room';
import { Genders } from '../../../../interfaces/soldier';
import { Types as UserTypes } from '../../../../interfaces/user';
// import { RequestsService } from '../../../../services/requests';
import { useUserStore } from '../../../../stores/user';
import { ICurrState } from '../../../../utils/resourcesTypes';
import { convertDateTolocaleString } from '../../../../utils/today';
// import { trycatch } from '../../../../utils/trycatch';
import Legend from '../../../Legend';
import AlertDialog from './AlertDialog';
import ColumnOfDetails from './ColumnOfDetails';
import ColumnOfRooms from './ColumnOfRooms';
import SingleDetail from './SingleDetail';

interface EventDetailsProps {
    populatedEvent: PopulatedEvent;
    open: boolean;
    handleClose: () => any;
}

const { colors } = environment;

const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    minHeight: 550,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: '0px 3px 6px #00000029',
    p: 4,
    outlineStyle: 'none',
};

const EventDetails = ({ populatedEvent, open, handleClose }: EventDetailsProps) => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [classes, setClasses] = useState<ICurrState[]>([]);
    const [offices, setOffices] = useState<ICurrState[]>([]);
    const [bedrooms, setBedrooms] = useState<RoomWithSoldiers[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const currentUser = useUserStore(({ user }) => user);
    const [eventToDelete, setEventToDelete] = useState<{ id: string; name: string }>({ id: '', name: '' });

    const handleCloseDialog = () => setOpenDialog(false);

    const checkFormat = (bedroomsArr: any[]) => {
        return bedroomsArr.length ? i18next.t('eventDetailsModal.formatTypes.closed') : i18next.t('eventDetailsModal.formatTypes.opened');
    };

    // const requestDeleteEvent = async (eventId: string) => {
    //     setOpenDialog(false);
    //     const { result, err } = await trycatch(() =>
    //         RequestsService.createOne({
    //             baseId: currentUser.baseId!,
    //             requesterId: currentUser.id!,
    //             type: RequestTypes.DELETE_COURSE,
    //             metaData: { eventId } as DeleteEventMetadata,
    //         }),
    //     );
    //     if (err) toast.error(i18next.t('wizard.error'));
    //     if (result)
    //         toast.success(currentUser.currentUserType === Types.SUPERADMIN ? i18next.t('wizard.superAdminSuccess') : i18next.t('wizard.success'));
    // };

    const getSingleDetail = ([fieldName, value]: any[]) => (
        <SingleDetail key={fieldName} title={fieldName} value={value === undefined ? '-' : String(value)} />
    );

    const getSingleDetailOfDateField = (fieldName: string) => {
        const fieldValue = populatedEvent[fieldName as keyof typeof populatedEvent];
        return getSingleDetail([fieldName, fieldValue ? convertDateTolocaleString(fieldValue as Date) : '-']);
    };

    const firstGroupOfDetails = [
        ['format', checkFormat(populatedEvent.rooms.filter(({ type }) => type === RoomTypes.BEDROOM))],
        ['base', populatedEvent.base.name],
    ];

    const forthGroupOfDetails = ['receivanceDate'];

    const dateFieldsToDisplay = ['startDate', 'endDate', 'basicTrainingStartDate', 'basicTrainingEndDate', 'enlistmentDate'];

    useEffect(() => {
        const classesFromRooms = populatedEvent.rooms
            .filter((room) => room.type === RoomTypes.CLASS)
            .map((room) => ({ roomName: room.name, currentCapacity: room.soldiers.length }));
        const officesFromRooms = populatedEvent.rooms
            .filter((room) => room.type === RoomTypes.OFFICE)
            .map((room) => ({ roomName: room.name, currentCapacity: room.soldiers.length }));
        const bedroomsFromRooms = populatedEvent.rooms.filter((room) => room.type === RoomTypes.BEDROOM);

        setBedrooms((currBedrooms) => [...currBedrooms, ...bedroomsFromRooms]);
        setClasses((currClasses) => [...currClasses, ...classesFromRooms]);
        setOffices((currOffices) => [...currOffices, ...officesFromRooms]);
    }, []);

    return (
        <>
            {/* {openDialog && (
                <AlertDialog
                    eventName={eventToDelete.name}
                    open={openDialog}
                    handleClose={handleCloseDialog}
                    handleSendRequest={() => requestDeleteEvent(eventToDelete.id)}
                />
            )} */}
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
                <div>
                    <Fade in={open}>
                        <div>
                            {pageIndex === 1 && (
                                <Box sx={style}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
                                        {populatedEvent.name}
                                    </Typography>
                                    <Grid container direction="row" justifyContent="center" spacing={8}>
                                        <Grid item>
                                            {firstGroupOfDetails.map(getSingleDetail)}

                                            {currentUser.currentUserType !== UserTypes.PLANNING && (
                                                <Button
                                                    sx={{
                                                        marginTop: '4rem',
                                                        color: 'black',
                                                        border: `0.063rem solid ${colors.button.errorSecondary}`,
                                                        borderRadius: '5px',
                                                        opacity: 1,
                                                        background: colors.button.errorPrimary,
                                                    }}
                                                    variant="text"
                                                    onClick={() => {
                                                        setOpenDialog(true);
                                                        setEventToDelete({
                                                            id: populatedEvent._id,
                                                            name: populatedEvent.name,
                                                        });
                                                    }}
                                                >
                                                    <CancelOutlined sx={{ color: '#FF0000' }} />
                                                    <Typography sx={{ color: '#FF0000', ml: '0.4rem', fontSize: '1rem' }}>
                                                        {i18next.t('eventDetailsModal.deleteEventRequest')}
                                                    </Typography>
                                                </Button>
                                            )}
                                        </Grid>
                                        <Grid item>
                                            {dateFieldsToDisplay.map((fieldName) => getSingleDetailOfDateField(fieldName))}
                                            {/* {secondGroupOfDetails.map(getSingleDetail)} */}
                                        </Grid>
                                        <Grid item>
                                            {/* {thirdGroupOfDetails.map(getSingleDetail)} */}
                                            {forthGroupOfDetails.map(getSingleDetailOfDateField)}
                                            {currentUser.currentUserType !== UserTypes.PLANNING && (
                                                <Button
                                                    sx={{ color: 'black', marginTop: '4rem' }}
                                                    variant="text"
                                                    onClick={() => {
                                                        setPageIndex(pageIndex + 1);
                                                    }}
                                                >
                                                    <Typography sx={{ mr: '1rem' }}>{i18next.t('eventDetailsModal.resources')}</Typography>
                                                    <ArrowBackIos />
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </div>
                    </Fade>
                    <Fade in={open}>
                        <div>
                            {pageIndex === 2 && (
                                <Box sx={style}>
                                    <Grid container direction="row" sx={{ mb: 4, display: 'flex' }}>
                                        <Grid item xs={9} sx={{ pl: '20rem' }}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {i18next.t('eventDetailsModal.resources')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Grid container direction="column" gap={0.1} sx={{ ml: '2rem' }}>
                                                <Grid item>
                                                    <Legend
                                                        items={[
                                                            {
                                                                dotColor: `${colors.gender.male}`,
                                                                text: `${i18next.t(`common.genders.${Genders.MALE}`)}`,
                                                            },
                                                            {
                                                                dotColor: `${colors.gender.female}`,
                                                                text: `${i18next.t(`common.genders.${Genders.FEMALE}`)}`,
                                                            },
                                                        ]}
                                                        sx={{ display: 'flex', gap: '0.92rem', pl: '1rem', pt: '0.3rem' }}
                                                        spacing="space-evenly"
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Legend
                                                        items={[
                                                            {
                                                                dotColor: `${colors.gender.otherMale}`,
                                                                text: `${i18next.t(`common.genders.${Genders.OTHER_MALE}`)}`,
                                                            },
                                                            {
                                                                dotColor: `${colors.gender.otherFemale}`,
                                                                text: `${i18next.t(`common.genders.${Genders.OTHER_FEMALE}`)}`,
                                                            },
                                                        ]}
                                                        sx={{ display: 'flex', gap: '1rem', pl: '1rem', pt: '0.3rem' }}
                                                        spacing="space-evenly"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" justifyContent="center" spacing={4} sx={{ ml: '2rem' }}>
                                        <Grid item xs={3.5}>
                                            <ColumnOfDetails title="classes" arrOfDetails={classes} />
                                        </Grid>
                                        <Grid item xs={3.5}>
                                            <ColumnOfDetails title="offices" arrOfDetails={offices} />
                                        </Grid>
                                        <Grid item xs={3.5}>
                                            <ColumnOfRooms arrOfRooms={bedrooms} />
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row" sx={{ mt: '5rem' }}>
                                        <Grid item>
                                            <Button
                                                sx={{ color: 'black' }}
                                                variant="text"
                                                onClick={() => {
                                                    setPageIndex(pageIndex - 1);
                                                }}
                                            >
                                                <ArrowForwardIos />
                                                <Typography sx={{ ml: '1rem' }}>{i18next.t('eventDetailsModal.basicInfo')}</Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </div>
                    </Fade>
                </div>
            </Modal>
        </>
    );
};

export default EventDetails;
