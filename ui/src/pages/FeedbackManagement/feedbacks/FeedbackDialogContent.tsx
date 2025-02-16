/* eslint-disable prettier/prettier */
import { Box, CircularProgress, DialogContent, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { convertDateTolocaleString } from '../../../utils/today';
import { CategoryTypes, PopulatedFeedback, UrgencyTypes } from '../../../interfaces/feedback';

interface IFeedbackDialogContentProps {
    populatedFeedback: PopulatedFeedback;
}

export const getFormattedItem = (title: string, value: string, isContent?: boolean) => (
    <Typography key={title} color={isContent ? 'rgba(0, 0, 0, 0.6)' : undefined}>
        <span style={{ fontWeight: 'bold' }}>{title}: </span>
        {value}
    </Typography>
);

const isNumber = (value: string) => /^\d+$/.test(value);

const formatDialogContentValue = (value: any) => {
    if (isNumber(value)) return value;

    if (Date.parse(value)) return convertDateTolocaleString(value);

    if (Object.values(CategoryTypes).includes(value)) return i18next.t(`feedbackManagementPage.categoryTypes.${value}`);
    if (Object.values(UrgencyTypes).includes(value)) return i18next.t(`feedbackManagementPage.urgencyTypes.${value}`);

    return i18next.exists(`feedbackManagementPage.${value}`) ? i18next.t(`feedbackManagementPage.${value}`) : String(value || '-');
};

export const FeedbackDialogContent = ({ populatedFeedback }: IFeedbackDialogContentProps) => {
    const [dialogContent, setDialogContent] = useState<React.ReactNode[] | null>(null);
    const [loading, setLoading] = useState(false);

    const getMultilineField = (fieldName: string, content: string) =>
        content && (
            <Box key={fieldName} sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                <Typography fontWeight="bold">{i18next.t(`feedbackManagementPage.${fieldName}`)}</Typography>
                <Typography>{content}</Typography>
            </Box>
        );

    const getDialogContent = async () => {
        setLoading(true);

        const { description, seen, _id, updatedAt, ...restOfPopulatedFeedback } = populatedFeedback;
        setDialogContent([
            Object.entries(restOfPopulatedFeedback).map(([key, value]) =>
                getFormattedItem(i18next.t(`feedbackManagementPage.${key}`), formatDialogContentValue(value), true),
            ),
            getMultilineField('description', description),
        ]);

        setLoading(false);
    };

    useEffect(() => {
        getDialogContent();
    }, []);

    return (
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: loading ? 'center' : undefined }}>
            {loading ? <CircularProgress size={100} /> : dialogContent}
        </DialogContent>
    );
};
