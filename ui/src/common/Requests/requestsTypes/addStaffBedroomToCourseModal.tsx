import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';
import React from 'react';
import { CoursesService } from '../../../services/courses';
import ModalItem from './ModalItem';

interface addStaffBedroomToCourseModalProps {
    request: any;
}

const AddStaffBedroomToCourseModal = ({ request }: addStaffBedroomToCourseModalProps) => {
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

export default AddStaffBedroomToCourseModal;
