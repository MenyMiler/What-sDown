/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable react-hooks/rules-of-hooks */
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import i18next from 'i18next';
import React, { useState, useEffect } from 'react';
import { getValueOfId, isValidMongoObjectId } from './utils';

const renderChange = (change: any) => {
    const [resolvedOldValue, setResolvedOldValue] = useState<string | string[] | null>(null);
    const [resolvedNewValue, setResolvedNewValue] = useState<string | string[] | null>(null);
    const [showOldChange, setShowOldChange] = useState<boolean>(true);
    const [showNewChange, setShowNewChange] = useState<boolean>(true);

    useEffect(() => {
        const resolveValues = async () => {
            let oldValues: any[] = [];
            let newValues: any[] = [];

            if (Array.isArray(change.oldValue)) {
                oldValues = await Promise.all(change.oldValue.map((value: string) => getValueOfId(value, change.path)));
            } else if (typeof change.oldValue === 'object') {
                if (change.oldValue === null) {
                    setShowOldChange(false);
                    return;
                }
                oldValues = Object.entries(change.oldValue)
                    .map(([keyOfChange, valueOfChange]) => {
                        valueOfChange = formatValue(valueOfChange);
                        return valueOfChange === null ? null : `${keyOfChange}: ${valueOfChange}`;
                    })
                    .filter(Boolean);
            } else if (isValidMongoObjectId(change.oldValue)) {
                oldValues = [await getValueOfId(change.oldValue, change.path)];
            } else {
                oldValues = [change.oldValue];
            }

            if (Array.isArray(change.newValue)) {
                newValues = await Promise.all(change.newValue.map((value: string) => getValueOfId(value, change.path)));
            } else if (typeof change.newValue === 'object') {
                if (change.newValue === null) {
                    setShowNewChange(false);
                    return;
                }
                newValues = Object.entries(change.newValue)
                    .map(([keyOfChange, valueOfChange]) => {
                        valueOfChange = formatValue(valueOfChange);
                        return valueOfChange === null ? null : `${keyOfChange}: ${valueOfChange}`;
                    })
                    .filter(Boolean);
            } else if (isValidMongoObjectId(change.newValue)) {
                newValues = [await getValueOfId(change.newValue, change.path)];
            } else {
                newValues = [change.newValue];
            }
            setResolvedOldValue(oldValues);
            setResolvedNewValue(newValues);
        };

        resolveValues();
    }, [change.path, change.oldValue, change.newValue]);

    useEffect(() => {
        const hasValidValue = (value: any) =>
            value !== null &&
            value !== undefined &&
            value !== '' &&
            (typeof value !== 'object' || Object.values(value).some((v) => v !== null && v !== undefined));

        setShowOldChange(hasValidValue(resolvedOldValue) || hasValidValue(change.oldValue));
        setShowNewChange(hasValidValue(resolvedNewValue) || hasValidValue(change.newValue));
    }, [resolvedOldValue, resolvedNewValue, change.oldValue, change.newValue]);

    const formatDate = (date: any) => {
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) return 'Invalid Date';

        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year}, ${hours}:${minutes}`;
    };

    const isValidDate = (value: any) => {
        const parsedDate = Date.parse(value);
        return !Number.isNaN(parsedDate) && typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    };

    const formatSoldierAmount = (value: string) => {
        return value
            .split(', ')
            .map((item) => {
                const [key, val] = item.split(':');
                const translatedKey = i18next.t(`activityLogs.metaData.${key.trim()}`, {
                    fallbackLng: 'en',
                    defaultValue: key.trim() || 'Unknown',
                });
                return `${translatedKey}: ${val.trim()}`;
            })
            .join(', ');
    };

    const formatValue = (value: any) => {
        if (isValidDate(value)) {
            return formatDate(value);
        }

        if (typeof value === 'string' && value.includes(':')) {
            return formatSoldierAmount(value);
        }

        if (typeof value === 'string' && /^[A-Z_]+$/.test(value)) {
            return i18next.t(`activityLogs.metaData.${value}`);
        }

        return value;
    };

    const renderValue = (value: any) => {
        if (Array.isArray(value)) {
            return value.map((v) => formatValue(v)).join(', ');
        }

        if (typeof value === 'object' && value !== null) {
            return Object.entries(value)
                .map(([key, val]) => {
                    const formattedValue = formatValue(val);
                    const translatedKey = i18next.t(`activityLogs.metaData.${key}`, {
                        fallbackLng: 'en',
                        defaultValue: key || 'Unknown',
                    });
                    return `${translatedKey}: ${formattedValue}`;
                })
                .join(', ');
        }

        if (isValidDate(value)) {
            return formatDate(value);
        }

        return i18next.t(`activityLogs.metaData.${value}`, { fallbackLng: 'en', defaultValue: value || '' });
    };

    if (change && change.path) {
        return (
            <Box key={change.path} mb={2} sx={{ direction: 'ltr', textAlign: 'left' }}>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1.2em' }}>
                    <span style={{ fontWeight: 'bold' }}>{i18next.t('activityLogs.metaData.path')} : </span>
                    <span> {i18next.t(`activityLogs.metaData.${change.path}`, { context: 'title' })}</span>
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1.1em' }}>
                    <span style={{ fontWeight: 'bold' }}>{showOldChange ? `${i18next.t('activityLogs.metaData.oldValue')} :` : ''} </span>
                    <span>{showOldChange ? renderValue(resolvedOldValue || change.oldValue) : ''} </span>
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1.1em' }}>
                    <span style={{ fontWeight: 'bold' }}>{showNewChange ? `${i18next.t('activityLogs.metaData.newValue')} :` : ''} </span>
                    <span>{showNewChange ? renderValue(resolvedNewValue || change.newValue) : ''} </span>
                </Typography>
            </Box>
        );
    }

    return null;
};

export default renderChange;
