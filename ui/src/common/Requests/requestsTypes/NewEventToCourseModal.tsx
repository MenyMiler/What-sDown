import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import { useQuery } from '@tanstack/react-query';
import ModalItem from './ModalItem';
import { convertDateTolocaleString } from '../../../utils/today';
import { CourseDocument } from '../../../interfaces/course';
import { CoursesService } from '../../../services/courses';

interface newCourseModalProps {
    request: any;
}

const NewEventToCourseModal = ({ request }: newCourseModalProps) => {
    const { data: course } = useQuery({
        queryKey: ['courses', request.metaData.courseId],
        queryFn: () => CoursesService.getById(request.metaData.courseId, false),
    });

    return (
        <>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
                {i18next.t(`requestDetailsModal.types.${request.type}`)}
            </Typography>
            <Grid container direction="column" justifyContent="center" spacing={1}>
                <ModalItem label="eventName" value={request.metaData.name} />
                <ModalItem label="courseName" value={course?.name ?? ''} />
                <ModalItem label="startDate" value={convertDateTolocaleString(request.metaData.startDate)} />
                <ModalItem label="endDate" value={convertDateTolocaleString(request.metaData.endDate)} />
                <ModalItem label="peopleAmount" value={request.metaData.participantsAmount} />
            </Grid>
        </>
    );
};

export default NewEventToCourseModal;
