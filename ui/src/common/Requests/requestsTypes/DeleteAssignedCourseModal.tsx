/* eslint-disable indent */
import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';
import React from 'react';
import { RoomTypes } from '../../../interfaces/room';
import { Genders } from '../../../interfaces/soldier';
import { CoursesService } from '../../../services/courses';
import { iterateOverRoomsForAmountOfSoldiers } from '../../../utils/dealingWithRoomInCourse';
import { convertDateTolocaleString } from '../../../utils/today';
import ModalItem from './ModalItem';
import { mapperForName } from '../../../utils/mapper';

interface deleteCourseModalProps {
    request: any;
}

const DeleteCourseModal = ({ request }: deleteCourseModalProps) => {
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
                    <ModalItem label="courseACAId" value={course.courseACAId} />
                    <ModalItem label="type" value={i18next.t(`common.types.${course.type}`)} />
                    <ModalItem label="courseStartDate" value={convertDateTolocaleString(course.startDate)} />
                    <ModalItem label="courseEndDate" value={convertDateTolocaleString(course.startDate)} />
                    <ModalItem label="network" value={mapperForName(course.networks).join(', ')} />
                    <ModalItem label="femaleAmount" value={iterateOverRoomsForAmountOfSoldiers(course.rooms, RoomTypes.BEDROOM, Genders.FEMALE)} />
                    <ModalItem label="maleAmount" value={iterateOverRoomsForAmountOfSoldiers(course.rooms, RoomTypes.BEDROOM, Genders.MALE)} />
                    <ModalItem
                        label="otherMaleAmount"
                        value={iterateOverRoomsForAmountOfSoldiers(course.rooms, RoomTypes.BEDROOM, Genders.OTHER_MALE)}
                    />
                    <ModalItem
                        label="otherFemaleAmount"
                        value={iterateOverRoomsForAmountOfSoldiers(course.rooms, RoomTypes.BEDROOM, Genders.OTHER_FEMALE)}
                    />
                </Grid>
            )}
        </>
    );
};

export default DeleteCourseModal;
