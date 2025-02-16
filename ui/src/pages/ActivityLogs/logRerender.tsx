/* eslint-disable guard-for-in */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import i18next from 'i18next';
import React, { useState } from 'react';
import { environment } from '../../globals';
import { ActionTypes, ActivityTypes } from '../../interfaces/activityLogs';
import { RoomTypes } from '../../interfaces/room';
import { Types } from '../../interfaces/user';
import ExcelTable from './excelTable';
import renderChange from './renderChange';
import { formatDate, getValueOfId, isValidMongoObjectId, transformKeys } from './utils';

const flattenObject = (obj: Record<string, unknown>, actionType: string): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                const flattenedSubObject = flattenObject(obj[key] as Record<string, unknown>, actionType);
                for (const subKey in flattenedSubObject) {
                    result[`${key}.${subKey}`] = flattenedSubObject[subKey];
                }
            } else {
                result[key] = obj[key];
            }
        }
    }

    return result;
};

const LogDataRenderer = ({
    data,
    type,
    actionType,
}: {
    data: Record<string, unknown> | null;
    type: ActivityTypes | null;
    actionType: ActionTypes | null;
}) => {
    const [resolvedValues, setResolvedValues] = useState<Record<string, string>>({});
    const [resolvedData, setResolvedData] = useState<Record<string, unknown>>({});
    const changes = data?.changes || [];

    const renderValueWithKey = async (key: string, value: unknown) => {
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        if (isValidMongoObjectId(value!.toString())) {
            const resolvedValue = await getValueOfId(value!.toString(), key);
            return resolvedValue.toString();
        }

        return value;
    };

    const renderValue = (value: unknown, key: string) => {
        if (key === 'exceptional') {
            return i18next.t(`common.${value}`);
        }

        if (!value) {
            return i18next.t('activityLogs.metaData.notExist');
        }

        if (key === '_id') {
            return null;
        }

        if (key === 'userType') {
            return i18next.t(`userTypes.${value}`);
        }

        if (key === 'status') {
            return i18next.t(`myRequests.statues.${value}`);
        }

        if (key === 'type') {
            if (Object.values(Types).find((element) => element === data!.type)) {
                return i18next.t(`userTypes.${value}`);
            }
            if (Object.values(RoomTypes).find((element) => element === value)) {
                return i18next.t(`common.roomTypes.${value}`);
            }
            return i18next.t(`common.types.${value}`);
        }

        if (key === 'soldierType') return i18next.t(`common.soldierTypes.${value}`);

        if (key === 'studentType') return i18next.t(`common.studentTypes.${value}`);

        if (key === 'gender') {
            return i18next.t(`common.genders.${value}`);
        }

        if (typeof value === 'boolean') {
            return value === true ? i18next.t('common.true') : i18next.t('common.false');
        }

        if (isValidMongoObjectId(value.toString())) {
            const cachedValue = resolvedValues[key];
            if (cachedValue) {
                return cachedValue;
            }

            renderValueWithKey(key, value).then((resolvedValue) => {
                setResolvedValues((prev) => ({ ...prev, [key]: resolvedValue!.toString() }));
            });
        }

        if (key === 'createdAt' || key === 'updatedAt') return formatDate(value);

        if (typeof value === 'string' && key.toLowerCase().includes('date')) {
            return formatDate(value);
        }

        return (
            <Typography variant="body1" color="textPrimary">
                {value.toString()}
            </Typography>
        );
    };

    if (type === ActivityTypes.EXCEL)
        if (Array.isArray(data?.excelData) && data!.excelData.every((item) => typeof item === 'object' && item !== null)) {
            return <ExcelTable filePreview={{ data: data!.excelData as Record<string, any>[] }} />;
        } else {
            console.error('Invalid data format for Excel:', data?.excelData);
            return <Typography>{i18next.t('activityLogs.excelError')}</Typography>;
        }
    let entries: {
        key: string;
        value: any;
    }[];
    const flatData = transformKeys(flattenObject(data || {}, actionType!));
    if (flatData && typeof flatData === 'object' && !Array.isArray(flatData)) {
        entries = Object.entries(flatData)
            .filter(([key]) => key !== '_id' && key !== 'excelData')
            .map(([key, value]) => ({
                key,
                value: renderValue(value, key),
            }));
    } else {
        console.error('flatData is not a valid object:', flatData);
    }

    let columnSize = type ? environment.logMetaDataColumnSize[type as keyof typeof environment.logMetaDataColumnSize] : 3;
    if (actionType === ActionTypes.EDIT) columnSize = 3;
    const columnsEntries = [];
    if (actionType !== ActionTypes.EDIT)
        while (entries!.length) {
            columnsEntries.push(entries!.splice(0, columnSize));
        }

    return (
        <Box>
            {Array.isArray(changes) && changes.length > 0
                ? changes.map((change: any, index: React.Key | null | undefined) => (
                      <Box key={index} mb={2}>
                          {renderChange(change)}
                      </Box>
                  ))
                : null}

            {columnsEntries.map((chunk, index) => (
                <Box key={index} mb={2}>
                    <Grid container spacing={2}>
                        {chunk.map(({ key, value }, subIndex) => (
                            <Grid item xs={12} md={4} key={subIndex}>
                                <Box>
                                    {key.includes('networks') ? (
                                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                            {i18next.t('activityLogs.metaData.networks')}
                                        </Typography>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                                            {i18next.t(`activityLogs.metaData.${key}`)}
                                        </Typography>
                                    )}
                                    <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                        {value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}
        </Box>
    );
};

export default LogDataRenderer;
