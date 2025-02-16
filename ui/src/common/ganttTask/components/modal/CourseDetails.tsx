/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
import { ArrowBackIos, ArrowForwardIos, CancelOutlined } from '@mui/icons-material';
import { Backdrop, Box, Button, Fade, Grid, Modal, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { environment } from '../../../../globals';
import { PopulatedCourse } from '../../../../interfaces/course';
import { RequestTypes } from '../../../../interfaces/request';
import { DeleteCourseMetadata } from '../../../../interfaces/request/metadata';
import { RoomTypes, RoomWithSoldiers } from '../../../../interfaces/room';
import { Genders } from '../../../../interfaces/soldier';
import { Types, Types as UserTypes } from '../../../../interfaces/user';
import { RequestsService } from '../../../../services/requests';
import { useUserStore } from '../../../../stores/user';
import { iterateOverRoomsForAmountOfSoldiers } from '../../../../utils/dealingWithRoomInCourse';
import { ICurrState } from '../../../../utils/resourcesTypes';
import { convertDateTolocaleString } from '../../../../utils/today';
import { trycatch } from '../../../../utils/trycatch';
import Legend from '../../../Legend';
import AlertDialog from './AlertDialog';
import ColumnOfDetails from './ColumnOfDetails';
import ColumnOfRooms from './ColumnOfRooms';
import SingleDetail from './SingleDetail';

interface courseDetailsProps {
    populatedCourse: PopulatedCourse;
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

const CourseDetails = ({ populatedCourse, open, handleClose }: courseDetailsProps) => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [classes, setClasses] = useState<ICurrState[]>([]);
    const [offices, setOffices] = useState<ICurrState[]>([]);
    const [bedrooms, setBedrooms] = useState<RoomWithSoldiers[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const currentUser = useUserStore(({ user }) => user);
    const [courseToDelete, setCourseToDelete] = useState<{ id: string; name: string }>({ id: '', name: '' });

    const totalSegel = (studentsAmount: number | string) =>
        populatedCourse.staffRatio ? Math.ceil(Number(studentsAmount) / Number(populatedCourse.staffRatio)).toString() : '-';

    const handleCloseDialog = () => setOpenDialog(false);

    const checkFormat = (bedroomsArr: any[]) => {
        return bedroomsArr.length ? i18next.t('courseDetailsModal.formatTypes.closed') : i18next.t('courseDetailsModal.formatTypes.opened');
    };

    const requestDeleteCourse = async (courseId: string) => {
        setOpenDialog(false);
        const { result, err } = await trycatch(() =>
            RequestsService.createOne({
                baseId: currentUser.baseId!,
                requesterId: currentUser.id!,
                type: RequestTypes.DELETE_COURSE,
                metaData: { courseId } as DeleteCourseMetadata,
            }),
        );
        if (err) toast.error(i18next.t('wizard.error'));
        if (result)
            toast.success(currentUser.currentUserType === Types.SUPERADMIN ? i18next.t('wizard.superAdminSuccess') : i18next.t('wizard.success'));
    };

    const getSingleDetail = ([fieldName, value]: any[]) => (
        <SingleDetail key={fieldName} title={fieldName} value={value === undefined ? '-' : String(value)} />
    );

    const getSingleDetailOfDateField = (fieldName: string) => {
        const fieldValue = populatedCourse[fieldName as keyof typeof populatedCourse];
        return getSingleDetail([fieldName, fieldValue ? convertDateTolocaleString(fieldValue as Date) : '-']);
    };

    const firstGroupOfDetails = [
        ['courseACAId', populatedCourse.courseACAId],
        ['type', i18next.t(`common.types.${populatedCourse.type}`)],
        ['branch', populatedCourse.branch.name],
        ['profession', populatedCourse.profession],
        ['format', checkFormat(populatedCourse.rooms.filter(({ type }) => type === RoomTypes.BEDROOM))],
        ['network', populatedCourse.networks?.map(({ name }) => name).join(', ')],
        ['base', populatedCourse.base.name],
    ];

    const secondGroupOfDetails = [
        ['RAKAZCourseDuration', populatedCourse.durations.rakaz],
        ['actualCourseDuration', populatedCourse.durations.actual],
    ];

    const thirdGroupOfDetails = [
        [
            'totalStudents',
            populatedCourse.currentSoldierAmounts.FEMALE +
                populatedCourse.currentSoldierAmounts.MALE +
                populatedCourse.currentSoldierAmounts.OTHER_FEMALE +
                populatedCourse.currentSoldierAmounts.OTHER_MALE,
        ],
        ['totalFemale', populatedCourse.currentSoldierAmounts.FEMALE],
        ['totalMale', populatedCourse.currentSoldierAmounts.MALE],
        ['totalOtherFemale', populatedCourse.currentSoldierAmounts.OTHER_FEMALE],
        ['totalOtherMale', populatedCourse.currentSoldierAmounts.OTHER_MALE],
        ['totalSegel', iterateOverRoomsForAmountOfSoldiers(populatedCourse.rooms, RoomTypes.BEDROOM, undefined, true)],
    ];

    const forthGroupOfDetails = ['receivanceDate'];

    const dateFieldsToDisplay = ['startDate', 'endDate', 'basicTrainingStartDate', 'basicTrainingEndDate', 'enlistmentDate'];

    useEffect(() => {
        const classesFromRooms = populatedCourse.rooms
            .filter((room) => room.type === RoomTypes.CLASS)
            .map((room) => ({ roomName: room.name, currentCapacity: room.soldiers.length }));
        const officesFromRooms = populatedCourse.rooms
            .filter((room) => room.type === RoomTypes.OFFICE)
            .map((room) => ({ roomName: room.name, currentCapacity: room.soldiers.length }));
        const bedroomsFromRooms = populatedCourse.rooms.filter((room) => room.type === RoomTypes.BEDROOM);

        setBedrooms((currBedrooms) => [...currBedrooms, ...bedroomsFromRooms]);
        setClasses((currClasses) => [...currClasses, ...classesFromRooms]);
        setOffices((currOffices) => [...currOffices, ...officesFromRooms]);
    }, []);

    return (
        <>
            {openDialog && (
                <AlertDialog
                    courseName={courseToDelete.name}
                    open={openDialog}
                    handleClose={handleCloseDialog}
                    handleSendRequest={() => requestDeleteCourse(courseToDelete.id)}
                />
            )}
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
                                        {populatedCourse.name}
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
                                                        setCourseToDelete({
                                                            id: populatedCourse._id,
                                                            name: populatedCourse.name,
                                                        });
                                                    }}
                                                >
                                                    <CancelOutlined sx={{ color: '#FF0000' }} />
                                                    <Typography sx={{ color: '#FF0000', ml: '0.4rem', fontSize: '1rem' }}>
                                                        {i18next.t('courseDetailsModal.deleteCourseRequest')}
                                                    </Typography>
                                                </Button>
                                            )}
                                        </Grid>
                                        <Grid item>
                                            {dateFieldsToDisplay.map((fieldName) => getSingleDetailOfDateField(fieldName))}
                                            {secondGroupOfDetails.map(getSingleDetail)}
                                        </Grid>
                                        <Grid item>
                                            {thirdGroupOfDetails.map(getSingleDetail)}
                                            {forthGroupOfDetails.map(getSingleDetailOfDateField)}
                                            {currentUser.currentUserType !== UserTypes.PLANNING && (
                                                <Button
                                                    sx={{ color: 'black', marginTop: '4rem' }}
                                                    variant="text"
                                                    onClick={() => {
                                                        setPageIndex(pageIndex + 1);
                                                    }}
                                                >
                                                    <Typography sx={{ mr: '1rem' }}>{i18next.t('courseDetailsModal.resources')}</Typography>
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
                                                {i18next.t('courseDetailsModal.resources')}
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
                                                <Typography sx={{ ml: '1rem' }}>{i18next.t('courseDetailsModal.basicInfo')}</Typography>
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

export default CourseDetails;
