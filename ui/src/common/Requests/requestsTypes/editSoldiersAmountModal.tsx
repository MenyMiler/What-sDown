import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import { useQuery } from '@tanstack/react-query';
import ModalItem from './ModalItem';
import { CourseDocument } from '../../../interfaces/course';
import { CoursesService } from '../../../services/courses';

interface editSoldierAmountsModalProps {
    request: any;
}

const EditSoldierAmountsModal = ({ request }: editSoldierAmountsModalProps) => {
    const { courseId, male, female, otherMale, otherFemale, specialMale, specialFemale, specialOtherMale, specialOtherFemale } = request.metaData;
    const { data: course } = useQuery({
        queryKey: ['courses', courseId],
        queryFn: () => CoursesService.getById(courseId, false),
    });

    return (
        <>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
                {i18next.t(`requestDetailsModal.types.${request.type}`)}
            </Typography>
            <Grid container direction="column" justifyContent="center" spacing={1}>
                <ModalItem label="courseName" value={course ? course.name : ''} />
                <ModalItem label="branch" value={course ? course.name : ''} />
                <ModalItem label="maleAmount" value={male} />
                <ModalItem label="femaleAmount" value={female} />
                <ModalItem label="otherMaleAmount" value={otherMale} />
                <ModalItem label="otherFemaleAmount" value={otherFemale} />
                <ModalItem label="specialMaleAmount" value={specialMale} />
                <ModalItem label="specialFemaleAmount" value={specialFemale} />
                <ModalItem label="specialOtherMaleAmount" value={specialOtherMale} />
                <ModalItem label="specialOtherFemaleAmount" value={specialOtherFemale} />
            </Grid>
        </>
    );
};

export default EditSoldierAmountsModal;
