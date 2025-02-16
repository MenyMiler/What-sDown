import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import { useQuery } from '@tanstack/react-query';
import ModalItem from './ModalItem';
import { Event } from '../../../interfaces/event';
import { EventsService } from '../../../services/events';
import { CoursesService } from '../../../services/courses';
import { CourseDocument } from '../../../interfaces/course';

interface newClassToEventModalProps {
    request: any;
}

const NewClassToEventModal = ({ request }: newClassToEventModalProps) => {
    const { data: event } = useQuery({
        queryKey: ['events', request.metaData.eventId],
        queryFn: () => EventsService.getById(request.metaData.eventId, false),
    });

    const { data: course } = useQuery({
        queryKey: ['events', event?.courseId], // eslint-disable-line @tanstack/query/exhaustive-deps
        queryFn: () => CoursesService.getById(event?.courseId as string, false),
        enabled: !!event?.courseId,
    });

    return (
        <>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
                {i18next.t(`requestDetailsModal.types.${request.type}`)}
            </Typography>
            <Grid container direction="column" justifyContent="center" spacing={1}>
                <ModalItem label="eventName" value={event?.name ?? ''} />
                <ModalItem label="courseName" value={course?.name ?? ''} />
                <ModalItem label="startDate" value={request.metaData.startDate} />
                <ModalItem label="endDate" value={request.metaData.endDate} />
                <ModalItem label="peopleAmount" value={request.metaData.amountOfPeople} />
            </Grid>
        </>
    );
};

export default NewClassToEventModal;
