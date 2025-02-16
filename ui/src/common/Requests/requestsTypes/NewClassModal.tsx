import React from 'react';
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import { useQuery } from '@tanstack/react-query';
import ModalItem from './ModalItem';
import { CoursesService } from '../../../services/courses';
import { mapperForName } from '../../../utils/mapper';

interface newClassModalProps {
    request: any;
}

const NewClassModal = ({ request }: newClassModalProps) => {
    const { data: course } = useQuery({
        queryKey: ['courses', request.metaData.courseId],
        queryFn: () => CoursesService.getById(request.metaData.courseId, true),
    });

    return (
        <>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
                {i18next.t(`requestDetailsModal.types.${request.type}`)}
            </Typography>
            {course && (
                <Grid container direction="column" justifyContent="center" spacing={1}>
                    <ModalItem label="courseName" value={course.name} />
                    <ModalItem label="branch" value={course.branch.name} />
                    <ModalItem label="networks" value={mapperForName(course.networks).join(', ')} />
                    <ModalItem label="amount" value={request.metaData.amount} />
                </Grid>
            )}
        </>
    );
};

export default NewClassModal;
