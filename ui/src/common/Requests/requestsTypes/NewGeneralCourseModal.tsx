import React from 'react';
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import ModalItem from './ModalItem';
import { convertDateTolocaleString } from '../../../utils/today';

interface newCourseTemplateModalProps {
    request: any;
}

const NewCourseTemplateModal = ({ request }: newCourseTemplateModalProps) => {
    const studentsAmount = Object.values(request.metaData.soldierAmounts).reduce((accumulator, item) => Number(accumulator) + Number(item), 0);
    const staffAmount: string = Math.ceil(Number(studentsAmount) / Number(request.metaData.staffRatio)).toString();

    return (
        <>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
                {i18next.t(`requestDetailsModal.types.${request.type}`)}
            </Typography>
            <Grid container direction="column" justifyContent="center" spacing={1}>
                <ModalItem label="courseName" value={request.metaData.name} />
                <ModalItem label="branch" value={request.metaData.branch} />
                <ModalItem label="id" value={request.metaData.id} />
                <ModalItem label="courseSAPId" value={request.metaData.courseSAPId} />
                <ModalItem label="profession" value={request.metaData.profession} />
                <ModalItem label="network" value={i18next.t(`common.networks.${request.metaData.network}`)} />
                <ModalItem label="type" value={i18next.t(`common.types.${request.metaData.type}`)} />
                <ModalItem label="staffRatio" value={`${request.metaData.staffRatio} : 1`} />
                <ModalItem label="staffAmount" value={staffAmount} />
                {request.metaData.startDate && <ModalItem label="courseStartDate" value={convertDateTolocaleString(request.metaData.startDate)} />}
                {request.metaData.endDate && <ModalItem label="courseEndDate" value={convertDateTolocaleString(request.metaData.endDate)} />}
                {request.metaData.duration && <ModalItem label="duration" value={request.metaData.duration} />}
                {request.metaData.soldierAmounts && (
                    <>
                        <ModalItem label="amountOfFemale" value={request.metaData.soldierAmounts.male} />
                        <ModalItem label="amountOfMale" value={request.metaData.soldierAmounts.female} />
                        <ModalItem label="amountOfOtherMale" value={request.metaData.soldierAmounts.otherMale} />
                        <ModalItem label="amountOfOtherFemale" value={request.metaData.soldierAmounts.otherFemale} />
                    </>
                )}
            </Grid>
        </>
    );
};

export default NewCourseTemplateModal;
