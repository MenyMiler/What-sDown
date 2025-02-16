/* eslint-disable import/no-unresolved */
import FemaleIcon from '@mui/icons-material/Female';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MaleIcon from '@mui/icons-material/Male';
import { Button, Grid } from '@mui/material';
import i18next from 'i18next';
import React, { Ref, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { CourseDocument } from '../../../interfaces/course';
import { RequestTypes } from '../../../interfaces/request';
import { Genders, SpecialGenders } from '../../../interfaces/soldier';
import { CoursesService } from '../../../services/courses';
import { LocalStorage } from '../../../utils/localStorage';
import { setValues } from '../../../utils/wizard';
import { genders, getGendersAsObject, getGendersAsYupObject, otherGenders, requiredString } from '../../../utils/yup';
import SnackBar from '../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../modals.styled';
import GridForCourse from './gridForCourse';
import GridForGenders from './gridForGenders';

const transferSoldierAmountsInfoSchema = yup.object({
    courseId: requiredString,
    destCourseId: requiredString,
    soldierAmounts: getGendersAsYupObject(),
    soldierAmountsDestCourse: getGendersAsYupObject(),
});

const srcCourseValues = {
    startDate: new Date(),
    endDate: new Date(),
    soldierAmounts: getGendersAsObject(0),
};

const destCourseValues = {
    startDateDestCourse: new Date(),
    endDateDestCourse: new Date(),
    soldierAmountsDestCourse: getGendersAsObject(0),
};

const TransferSoldierAmountsRequest = () => {
    const { setValue, watch } = useFormContext();
    const [srcCourse, setSrcCourse] = useState<CourseDocument>();
    const [destCourse, setDestCourse] = useState<CourseDocument | null>();
    const [displayOtherGender, setDisplayOtherGender] = useState(false);
    const [displaySavedData, setDisplaySavedData] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>();
    const formValues = watch();

    const setTextFields = (currentCourse: CourseDocument) => {
        if (!currentCourse) genders.map((gender) => setValue(`soldierAmounts.${gender}`, ''));
        else {
            setSrcCourse(currentCourse);
            const { soldierAmounts, startDate, endDate } = currentCourse;
            setValues<typeof srcCourseValues>(
                {
                    soldierAmounts,
                    startDate,
                    endDate,
                },
                setValue,
            );
        }
    };

    useEffect(() => {
        if (buttonRef.current) buttonRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [displayOtherGender]);

    const setDisabledTextFields = (currentCourse: CourseDocument | null) => {
        if (!currentCourse) {
            setDestCourse(null);
            if (srcCourse) setTextFields(srcCourse);
            genders.map((gender) => setValue(`soldierAmountsDestCourse.${gender}`, ''));
        } else {
            setDestCourse(currentCourse);
            const { soldierAmounts, startDate, endDate } = currentCourse;
            setValues<typeof destCourseValues>(
                {
                    soldierAmountsDestCourse: soldierAmounts,
                    startDateDestCourse: startDate,
                    endDateDestCourse: endDate,
                },
                setValue,
            );
        }
    };

    const getCourseAndSetSavedValues = async (courseId: string, setFields: (currentCourse: CourseDocument) => void, savedDate: any) => {
        const course = await CoursesService.getById(courseId, false);
        setFields(course);
        setValues(savedDate, setValue);
    };

    useEffect(() => {
        if (!displaySavedData) return;
        const savedData = LocalStorage.get(RequestTypes.TRANSFER_SOLDIERS_AMOUNT, '');
        if (!savedData) return;
        const parsedData = JSON.parse(savedData);
        const { courseId, destCourseId } = parsedData;
        if (courseId) getCourseAndSetSavedValues(courseId, setTextFields, parsedData);
        if (destCourseId) getCourseAndSetSavedValues(destCourseId, setDisabledTextFields, parsedData);
    }, [displaySavedData]);

    const handleChangeSoldierAmounts = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!srcCourse || !destCourse || srcCourse._id === destCourse._id) {
            const errorMessage = i18next.t(
                `wizard.transferSoldierAmountsRequest.${srcCourse?._id === destCourse?._id ? 'errorSelectSameCourse' : 'errorSelectCourse'}`,
            );
            toast.info(errorMessage);
        } else {
            const gender = name.split('.')[1] as Genders | SpecialGenders;
            if (+value > srcCourse.soldierAmounts[gender]) {
                toast.info(i18next.t('wizard.transferSoldierAmountsRequest.errorSelectAmount'));
                return;
            }
            setValue(name, value);
            setValue(`soldierAmountsDestCourse.${gender}`, destCourse.soldierAmounts[gender] + srcCourse.soldierAmounts[gender] - +value);
            LocalStorage.set(RequestTypes.TRANSFER_SOLDIERS_AMOUNT, JSON.stringify(formValues));
        }
    };

    const buttonStyle = {
        backgroundColor: '#F5F5F5',
        width: '17%',
        height: '10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <GridWrapper style={{ maxHeight: '39rem', overflowY: 'auto', paddingLeft: '2%' }}>
            <SnackBar setDisplaySavedData={setDisplaySavedData} requestType={RequestTypes.TRANSFER_SOLDIERS_AMOUNT} />
            <GridWrapper container sx={{ minHeight: '39rem' }}>
                <Grid>
                    <GridWithMultipleItems container>
                        <Grid sx={{ fontSize: 'medium', marginLeft: '13%' }} item>
                            {i18next.t('wizard.transferSoldierAmountsRequest.transferFrom')}
                        </Grid>
                        <Grid sx={{ fontSize: 'medium', marginRight: '18%' }} item>
                            {i18next.t('wizard.transferSoldierAmountsRequest.to')}
                        </Grid>
                    </GridWithMultipleItems>

                    <GridWithMultipleItems sx={{ marginTop: '1%' }} container>
                        <GridForCourse displaySavedData={displaySavedData} setDisabledTextFields={setTextFields} values={srcCourseValues} />
                        <GridForCourse
                            displaySavedData={displaySavedData}
                            name="destCourseId"
                            setDisabledTextFields={setDisabledTextFields}
                            values={destCourseValues}
                        />
                    </GridWithMultipleItems>
                </Grid>
                <Grid>
                    <Grid>
                        {genders.map((gender) => (
                            <GridForGenders key={uuidv4()} gender={gender} handleChange={handleChangeSoldierAmounts} />
                        ))}
                    </Grid>
                    <Grid sx={{ marginTop: '2%' }}>
                        <Button ref={buttonRef as Ref<HTMLButtonElement>} onClick={() => setDisplayOtherGender(!displayOtherGender)} sx={buttonStyle}>
                            <MaleIcon style={{ transform: 'rotate(90deg)', color: 'grey' }} />
                            <FemaleIcon style={{ transform: 'rotate(40deg)', color: 'grey' }} />
                            {displayOtherGender ? (
                                <KeyboardArrowUpIcon fontSize="small" style={{ color: 'grey' }} />
                            ) : (
                                <KeyboardArrowDownIcon fontSize="small" style={{ color: 'grey' }} />
                            )}
                        </Button>
                        {displayOtherGender ? (
                            <Grid sx={{ background: '#F5F5F5' }} direction="column" container>
                                {otherGenders.map((gender) => (
                                    <GridForGenders key={uuidv4()} gender={gender} handleChange={handleChangeSoldierAmounts} />
                                ))}
                            </Grid>
                        ) : null}
                    </Grid>
                </Grid>
            </GridWrapper>
        </GridWrapper>
    );
};

export { TransferSoldierAmountsRequest, transferSoldierAmountsInfoSchema };
