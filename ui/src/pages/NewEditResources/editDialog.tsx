/* eslint-disable react/require-default-props */
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { RoomWithCapacity } from '../../interfaces/room';
import State from './state';
import { StateTypes } from './chunk';
import CapacityButton from './capacityButton';
import { ResourcesTypes } from './extendedCube';
import { RoomInCourseService } from '../../services/roomInCourse';

interface EditDialogProps {
    open: boolean;
    handleClose: () => any;
    handleUpdateSelectedResource: (resource: RoomWithCapacity, value: number) => any;
    resource: RoomWithCapacity & { occupation: number };
    getCorrectResourceType: (room: RoomWithCapacity) => ResourcesTypes;
    courseId?: string;
    eventId?: string;
}

const EditDialog = ({ open, handleClose, handleUpdateSelectedResource, resource, getCorrectResourceType, courseId, eventId }: EditDialogProps) => {
    const [value, setValue] = useState<number>(resource.currentCapacity);
    const [lastCapacity, setLastCapacity] = useState<number>(0);
    const [usedBy, setUsedBy] = useState<{ name: string; occupation: string; _id: string; startDate: Date; endDate: Date }[]>([]);
    const resourceId = courseId || eventId;

    useEffect(() => {
        const addLastCapacity = async () => {
            const rooms: any[] = await RoomInCourseService.editResourcesHelperFunction(resource._id, resourceId!);
            const withoutCurrCourse = rooms.filter(({ id }) => id !== resourceId);
            setUsedBy(withoutCurrCourse);
            setLastCapacity(withoutCurrCourse.reduce((max, room) => Math.max(max, room.occupation), 0));
        };
        addLastCapacity();
    }, [resource]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '2rem' }}>
                <Typography variant="h6" align="left" sx={{ flex: 1 }}>
                    {i18next.t('newEditResourcesPage.editDialog.title')}
                </Typography>
                <IconButton onClick={handleClose} edge="start" size="small" sx={{ marginRight: '-8px' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'start', padding: '1.5rem' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                    <Typography variant="body1">{i18next.t('newEditResourcesPage.state')}</Typography>
                    <State state={resource.currentCapacity === resource.maxCapacity ? StateTypes.FULL : StateTypes.OCCUPIED} />
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                    <Typography variant="body1">{i18next.t('newEditResourcesPage.resource')}</Typography>
                    <Typography variant="body1">{i18next.t(`newEditResourcesPage.${getCorrectResourceType(resource)}`)}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                    <Typography variant="body1">{i18next.t('newEditResourcesPage.editDialog.name')}</Typography>
                    <Typography variant="body1">{resource.name}</Typography>
                </Box>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" p={1}>
                    <Box>
                        <Typography variant="body1">{i18next.t('newEditResourcesPage.max')}</Typography>
                        <Typography variant="body2" color="#00000099" style={{ whiteSpace: 'pre-line' }}>
                            {usedBy
                                .map(
                                    ({ name, occupation, startDate, endDate }) =>
                                        `(${occupation}) ${name} ${new Date(endDate).toLocaleDateString('he')} - ${new Date(
                                            startDate,
                                        ).toLocaleDateString('he')}\n`,
                                )
                                .join('')}
                        </Typography>
                    </Box>
                    <Typography variant="body1">
                        {resource.occupation + resource.currentCapacity}/{resource.maxCapacity}
                    </Typography>
                </Box>
                <Divider sx={{ my: '1rem' }} />
                <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                    <Typography variant="body1">{i18next.t('newEditResourcesPage.current')}</Typography>
                    <CapacityButton value={value} setValue={setValue} max={resource.maxCapacity - lastCapacity} min={0} />
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'end', padding: '1rem' }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="inherit"
                    sx={{
                        borderColor: '#c4c4c4',
                        color: 'black',
                        textTransform: 'none',
                        padding: '0.5rem 2rem',
                        borderRadius: '1rem',
                    }}
                >
                    {i18next.t('newEditResourcesPage.deleteDialog.cancelBtn')}
                </Button>
                <Button
                    size="large"
                    sx={{
                        bgcolor: 'black',
                        color: 'white',
                        borderRadius: '2rem',
                        px: '2rem',
                        fontSize: '1rem',
                        '&:hover': {
                            bgcolor: 'darkgray',
                        },
                        '&.Mui-disabled': {
                            bgcolor: 'darkgray',
                            opacity: 0.8,
                        },
                    }}
                    onClick={() => handleUpdateSelectedResource(resource, value)}
                    disabled={resource.currentCapacity === value}
                >
                    {i18next.t('newEditResourcesPage.saveBtn')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
