import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import { useQuery } from '@tanstack/react-query';
import ModalItem from './ModalItem';
import { CourseDocument } from '../../../interfaces/course';
import { CoursesService } from '../../../services/courses';

interface addBedroomToCourseModalProps {
    request: any;
}

const AddBedroomToCourseModal = ({ request }: addBedroomToCourseModalProps) => {
    const { data: course } = useQuery({
        queryKey: ['courses', request.metaData.courseId],
        queryFn: () => CoursesService.getById(request.metaData.courseId, true),
    });

    return (
        <>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
                {i18next.t(`requestDetailsModal.types.${request.type}`)}
            </Typography>
            <Grid container direction="column" justifyContent="center" spacing={1}>
                <ModalItem label="courseName" value={course ? course.name : ''} />
                <ModalItem label="branch" value={course ? course.branch.name : ''} />
                <ModalItem label="peopleAmount" value={request.metaData.amountOfPeople} />
            </Grid>
        </>
    );
};

export default AddBedroomToCourseModal;
