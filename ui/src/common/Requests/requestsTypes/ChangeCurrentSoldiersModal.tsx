import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import { useQuery } from '@tanstack/react-query';
import ModalItem from './ModalItem';
import { CourseDocument } from '../../../interfaces/course';
import { Genders } from '../../../interfaces/soldier';
import { CoursesService } from '../../../services/courses';
import { iterateOverRoomsForAmountOfSoldiers } from '../../../utils/dealingWithRoomInCourse';
import { RoomTypes } from '../../../interfaces/room';

interface changeCurrentSoldiersModalProps {
    request: any;
}

const ChangeCurrentSoldiersModal = ({ request }: changeCurrentSoldiersModalProps) => {
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
                    <ModalItem
                        label="femaleAmountBefore"
                        value={iterateOverRoomsForAmountOfSoldiers(course.rooms, RoomTypes.BEDROOM, Genders.FEMALE)}
                    />
                    <ModalItem label="femaleAmountAfter" value={request.metaData.newFemaleAmount} />
                    <ModalItem label="maleAmountBefore" value={iterateOverRoomsForAmountOfSoldiers(course.rooms, RoomTypes.BEDROOM, Genders.MALE)} />
                    <ModalItem label="maleAmountAfter" value={request.metaData.newMaleAmount} />
                    <ModalItem
                        label="otherMaleAmountBefore"
                        value={iterateOverRoomsForAmountOfSoldiers(course.rooms, RoomTypes.BEDROOM, Genders.OTHER_MALE)}
                    />
                    <ModalItem label="otherMaleAmountAfter" value={request.metaData.newFemaleAmount} />
                    <ModalItem
                        label="otherFemaleAmountBefore"
                        value={iterateOverRoomsForAmountOfSoldiers(course.rooms, RoomTypes.BEDROOM, Genders.OTHER_FEMALE)}
                    />
                    <ModalItem label="otherFemaleAmountAfter" value={request.metaData.newFemaleAmount} />
                </Grid>
            )}
        </>
    );
};

export default ChangeCurrentSoldiersModal;
