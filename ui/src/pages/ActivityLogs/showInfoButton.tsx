/* eslint-disable react/destructuring-assignment */
import { MoreHorizOutlined } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import i18next from 'i18next';
import React, { useState } from 'react';
import { ActionTypes, ActivityTypes, Log, LogDocument } from '../../interfaces/activityLogs';
import DialogComponent from './logsModal';

const ShowMoreInfoButton = ({ data }: { data: Log }) => {
    const [open, setOpen] = useState(false);
    const [rowData, setRowData] = useState<Record<string, unknown> | null>(null);
    const [type, setType] = useState<ActivityTypes | null>(null);
    const [actionType, setActionType] = useState<ActionTypes | null>(null);

    const handleClick = () => {
        const { metaData, type: logType, action } = data;
        setRowData(metaData);
        setOpen(true);
        setType(logType);
        setActionType(action);
    };

    const handleClose = () => setOpen(false);

    return (
        <>
            <Tooltip title={i18next.t('activityLogs.moreDetails')}>
                <Button onClick={handleClick}>
                    <MoreHorizOutlined sx={{ color: 'black' }} />
                </Button>
            </Tooltip>
            <DialogComponent open={open} onClose={handleClose} rowData={rowData} actionType={actionType} type={type} />
        </>
    );
};

export default ShowMoreInfoButton;
