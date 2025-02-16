import React from 'react';
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import ModalItem from './ModalItem';
import { convertDateTolocaleString } from '../../../utils/today';

interface newCourseModalProps {
    request: any;
}

const NewCourseModal = ({ request }: newCourseModalProps) => {
    return (
        <>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
                {i18next.t(`requestDetailsModal.types.${request.type}`)}
            </Typography>
            <Grid container direction="column" justifyContent="center" spacing={1}>
                <ModalItem label="courseName" value={request.metaData.courseName} />
                <ModalItem label="type" value={i18next.t(`requestDetailsModal.types.${request.type}`)} />
                <ModalItem label="branch" value={request.metaData.branch} />
                <ModalItem label="network" value={i18next.t(`common.networks.${request.metaData.network}`)} />
                <ModalItem label="courseStartDate" value={convertDateTolocaleString(request.metaData.startDate)} />
                <ModalItem label="courseEndDate" value={convertDateTolocaleString(request.metaData.endDate)} />
                <ModalItem label="year" value={request.metaData.year} />
                <ModalItem label="basicTrainingStartDate" value={convertDateTolocaleString(request.metaData.basicTrainingStartDate)} />
                <ModalItem label="basicTrainingEndDate" value={convertDateTolocaleString(request.metaData.basicTrainingEndDate)} />
                <ModalItem label="RAKAZCourseDuration" value={request.metaData.RAKAZCourseDuration} />
                <ModalItem label="actualCourseDuration" value={request.metaData.actualCourseDuration} />
                <ModalItem label="receivanceDate" value={convertDateTolocaleString(request.metaData.receivanceDate)} />
                {request.metaData.enlistmentDate && (
                    <ModalItem label="enlistmentDate" value={convertDateTolocaleString(request.metaData.enlistmentDate)} />
                )}
            </Grid>
        </>
    );
};

export default NewCourseModal;
