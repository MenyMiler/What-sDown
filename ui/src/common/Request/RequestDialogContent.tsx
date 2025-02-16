/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable default-case */
import { Box, CircularProgress, DialogContent, Divider, Grid, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { PopulatedCourse } from '../../interfaces/course';
import { Types } from '../../interfaces/courseTemplate';
import { EventDocument } from '../../interfaces/event';
import { RequestStatuses, RequestTypes } from '../../interfaces/request';
import { RoomTypes } from '../../interfaces/room';
import { Genders } from '../../interfaces/soldier';
import { Types as UserTypes } from '../../interfaces/user';
import { BasesService } from '../../services/bases';
import { BranchesService } from '../../services/branches';
import { CoursesService } from '../../services/courses';
import { EventsService } from '../../services/events';
import { mapperForName } from '../../utils/mapper';
import { convertDateTolocaleString } from '../../utils/today';

interface IRequestDialogContentProps {
    request: any;
}

const sumObjectProperties = (obj: any): number => {
    return Object.keys(obj).reduce((sum, key) => sum + obj[key], 0);
};

export const getFormattedItem = (title: string, value: string, isContent?: boolean) => (
    <Typography key={uuidv4()} color={isContent ? 'rgba(0, 0, 0, 0.6)' : undefined}>
        <span style={{ fontWeight: 'bold' }}>{title} </span>
        {value}
    </Typography>
);

const isIsoDate = (str: string) => {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;

    const d = new Date(str);
    return d instanceof Date && !Number.isNaN(d.getTime()) && d.toISOString() === str;
};

const formatField = (value: any) => {
    if (_.isNumber(value)) return String(value);

    if (isIsoDate(value)) return convertDateTolocaleString(value);
    if (Object.values(RoomTypes).includes(value)) return i18next.t(`common.roomTypes.${value}`);
    if (Object.values(UserTypes).includes(value)) return i18next.t(`userTypes.${value}`);
    if (Object.values(Genders).includes(value)) return i18next.t(`common.genders.${value}`);
    if (Object.values(Types).includes(value)) return i18next.t(`common.types.${value}`);

    return i18next.exists(`common.${value}`) ? i18next.t(`common.${value}`) : String(value || '-');
};

export const RequestDialogContent = (props: IRequestDialogContentProps) => {
    const { request } = props;

    const statusCondition = request.status === RequestStatuses.PENDING;

    const [dialogContent, setDialogContent] = useState<React.ReactNode[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [isCourseOrEventExist, setIsCourseOrEventExist] = useState(true);

    const getCourseInfo = ({ name, courseACAId, type, networks, branch, startDate, endDate }: PopulatedCourse) => ({
        courseName: name,
        courseACAId,
        courseType: i18next.t(`common.types.${type}`),
        network: request.network ? request.network.name : networks ? mapperForName(networks).join(', ') : '',
        branch: branch.name,
        startDate: convertDateTolocaleString(startDate),
        endDate: convertDateTolocaleString(endDate),
    });

    const getAdditionalMetaData = (type: RequestTypes, course: PopulatedCourse) => {
        const { MALE, FEMALE, OTHER_MALE, OTHER_FEMALE, SPECIAL_MALE, SPECIAL_FEMALE, SPECIAL_OTHER_MALE, SPECIAL_OTHER_FEMALE } =
            course.soldierAmounts;

        switch (type) {
            case RequestTypes.EDIT_SOLDIERS_AMOUNT:
                return {
                    maleAmountBefore: MALE,
                    femaleAmountBefore: FEMALE,
                    otherMaleAmountBefore: OTHER_MALE,
                    otherFemaleAmountBefore: OTHER_FEMALE,
                    specialMaleAmountBefore: SPECIAL_MALE,
                    specialFemaleAmountBefore: SPECIAL_FEMALE,
                    specialOtherMaleAmountBefore: SPECIAL_OTHER_MALE,
                    specialOtherFemaleAmountBefore: SPECIAL_OTHER_FEMALE,
                };
            case RequestTypes.TRANSFER_SOLDIERS_AMOUNT:
                return {
                    soldierAmounts: sumObjectProperties(course.soldierAmounts),
                };
            case RequestTypes.CHANGE_DATES:
                return {
                    previousStartDateBefore: convertDateTolocaleString(course.startDate),
                    previousEndDateBefore: convertDateTolocaleString(course.endDate),
                };
            case RequestTypes.DELETE_COURSE:
                return {
                    maleAmount: MALE,
                    femaleAmount: FEMALE,
                    otherMaleAmount: OTHER_MALE,
                    otherFemaleAmount: OTHER_FEMALE,
                };
            default:
                return {};
        }
    };

    const getEventInfo = ({ name, description, startDate, endDate, amount }: EventDocument) => ({
        eventName: name,
        description,
        startDate: convertDateTolocaleString(startDate),
        endDate: convertDateTolocaleString(endDate),
        amount,
    });

    const getMultilineField = (fieldName: string, content: string) =>
        content && (
            <Box key={fieldName} sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                <Typography fontWeight="bold">{i18next.t(`common.${fieldName}`)}</Typography>
                <Typography>{content}</Typography>
            </Box>
        );

    const setMetadataPropertiesByRequest = async (destCourseId: string, rest: any) => {
        try {
            const course = await CoursesService.getById(destCourseId, false);
            const { soldierAmountsDestCourse } = rest;
            const destCourse = { destCourseId: course.name, startDateDestCourse: course.startDate, endDateDestCourse: course.endDate };
            const currentSoldierAmounts = sumObjectProperties(course.soldierAmounts);
            const amountOfPeopleToAdd = sumObjectProperties(soldierAmountsDestCourse as any) - (currentSoldierAmounts as number);
            return { newSoldierAmounts: amountOfPeopleToAdd, ...destCourse, currentSoldierAmounts, amountOfPeopleToAdd };
        } catch (error) {
            setIsCourseOrEventExist(false);
            toast.error(i18next.t('resourceManagement.errors.course'));
        }
    };

    const getDialogContent = async () => {
        setLoading(true);

        const {
            metaData: { courseId, eventId, comments, response, requestedUserType, base, destCourseId, branchId, ...rest },
        } = request;

        let orderedMetaData: any = {};

        if (courseId) {
            try {
                const course = await CoursesService.getById(courseId, true);
                orderedMetaData = { ...getCourseInfo(course), ...getAdditionalMetaData(request.type, course) };
            } catch (error) {
                setIsCourseOrEventExist(false);
                toast.error(i18next.t('resourceManagement.errors.course'));
            }
        } else if (eventId) {
            try {
                const event = await EventsService.getById(eventId, false);
                orderedMetaData = getEventInfo(event);
            } catch (error) {
                setIsCourseOrEventExist(false);
                toast.error(i18next.t('resourceManagement.errors.event'));
            }
        } else if (requestedUserType) {
            orderedMetaData = { requestedUserType };
        } else if (branchId) {
            try {
                const branch = await BranchesService.getById(branchId);
                orderedMetaData = { ...orderedMetaData, branch: branch.name };
            } catch (error) {
                toast.error(i18next.t('resourceManagement.errors.branch'));
            }
        }
        if (base) {
            try {
                const requestedBase = await BasesService.getById(base);
                orderedMetaData = { ...orderedMetaData, base: requestedBase.name, eventName: rest.name };
                delete rest.name;
            } catch (error) {
                toast.error(i18next.t('resourceManagement.errors.base'));
            }
        }

        switch (request.type) {
            case RequestTypes.TRANSFER_SOLDIERS_AMOUNT: {
                const requestedProperties = await setMetadataPropertiesByRequest(destCourseId, rest);
                orderedMetaData = { ...orderedMetaData, ...requestedProperties };
                break;
            }
            case RequestTypes.NEW_EVENT: {
                orderedMetaData = { eventName: rest.name };
                delete rest.name;
                break;
            }
            case RequestTypes.NEW_COURSE_TEMPLATE: {
                orderedMetaData = { ...orderedMetaData, network: request.network.name };
                break;
            }
            case RequestTypes.NEW_CLASS:
            case RequestTypes.NEW_OFFICE: {
                const { type, amount } = rest;
                orderedMetaData = { ...orderedMetaData, amount };
                delete rest.type;
                rest.resourceType = type;
                break;
            }
            case RequestTypes.NEW_CLASS_TO_EVENT:
            case RequestTypes.NEW_OFFICE_TO_EVENT: {
                const { type } = rest;
                delete orderedMetaData.amount;
                delete rest.type;
                rest.resourceType = type;
                break;
            }
            case RequestTypes.CHANGE_DATES: {
                delete orderedMetaData.endDate;
                delete orderedMetaData.startDate;
                break;
            }
            case RequestTypes.EDIT_SOLDIERS_AMOUNT: {
                Object.keys(orderedMetaData).map((key) => {
                    if (orderedMetaData[key] === orderedMetaData[`${key}Before`]) {
                        delete orderedMetaData[key];
                        delete orderedMetaData[`${key}Before`];
                    }
                    return orderedMetaData;
                });
                break;
            }
            case RequestTypes.NEW_COURSE: {
                orderedMetaData = { ...orderedMetaData, network: request.network.name, amountOfPeople: sumObjectProperties(rest.soldierAmounts) };
                delete rest.soldierAmounts;
                break;
            }
        }

        if (request.type !== RequestTypes.TRANSFER_SOLDIERS_AMOUNT) {
            orderedMetaData = {
                ...Object.keys(rest)
                    .filter((key) => i18next.exists(`common.${key}`))
                    .reduce((obj, key) => ({ ...obj, [key]: rest[key] }), {}),
                ...orderedMetaData,
            };
        }

        setDialogContent([
            Object.entries(orderedMetaData).map(([key, value]) => getFormattedItem(i18next.t(`common.${key}`), formatField(value), true)),
            getMultilineField('comments', comments),
            getMultilineField('response', response),
        ]);

        setLoading(false);
    };

    useEffect(() => {
        getDialogContent();
    }, []);

    return (
        <Grid item container direction="column">
            <Divider sx={{ ml: statusCondition ? '1.5rem' : '', mb: '1.5rem' }} />
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10rem',
                    alignItems: 'start',
                    ml: '1.5rem',
                    mr: statusCondition ? '' : '1.5rem',
                    mb: statusCondition ? '' : '1.5rem',
                    backgroundColor: '#F7F8FE',
                }}
            >
                {loading ? (
                    <CircularProgress size={100} />
                ) : (
                    <Grid item container>
                        {!isCourseOrEventExist && (
                            <Grid container item direction="row" gap={1} sx={{ mb: 1 }}>
                                <Grid item>
                                    <InfoIcon color="error" />
                                </Grid>
                                <Grid item>
                                    <Typography color="error">{i18next.t('wizard.deletedCourse')}</Typography>
                                </Grid>
                            </Grid>
                        )}
                        <Grid item container gap={1}>
                            {dialogContent?.flat().map((field, index) => (
                                // eslint-disable-next-line react/no-array-index-key, react/no-children-prop
                                <Grid item key={index} xs={12} children={field} />
                            ))}
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
        </Grid>
    );
};
