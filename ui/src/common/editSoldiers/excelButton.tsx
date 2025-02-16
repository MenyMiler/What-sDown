/* eslint-disable no-param-reassign */
import { Button, Typography } from '@mui/material';
import i18next from 'i18next';
import * as React from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Soldier, SoldierTypes, SpecialStudentTypes } from '../../interfaces/soldier';
import { ReactComponent as ExcelIcon } from '../../svgs/excelIcon.svg';
import excelParser from '../../utils/excel/parser';
import { trycatch } from '../../utils/trycatch';
import { i18TranslateCategories } from '../../utils/excel/categories';
import { SoldiersInRoomInCourseService } from '../../services/soldiersInRoomInCourse';

interface IExcelProps {
    reloadSoldiers: () => void;
    courseId: string;
    disabled: boolean;
    soldierType: SoldierTypes;
}

const ExcelButton = ({ reloadSoldiers, courseId, disabled, soldierType }: IExcelProps) => {
    const handleChange = async (event: any) => {
        const file = event.target.files[0];

        const { err: parseErr, result: students } = await trycatch(() => excelParser(file, i18TranslateCategories.i18TranslateStudentCategories));

        if (parseErr) {
            toast.error(i18next.t(`excelCategories.errors.${(parseErr as Error).message}`));
            return;
        }

        const soldiers = (students as Soldier[]).map((student: Soldier) => ({
            ...student,
            soldierType,
            studentType: soldierType === SoldierTypes.STUDENT ? student.studentType : SpecialStudentTypes.REGULAR,
        }));
        try {
            await SoldiersInRoomInCourseService.createSoldiersAndAddToRoomInCourse(courseId, soldiers);
            toast.success(i18next.t('excelCategories.createdSuccessfully'));
            reloadSoldiers();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) toast.error(i18next.t(`editUser.errors.${err.response.data.message}`));
        } finally {
            event.target.value = '';
        }
    };

    return (
        <label htmlFor="upload-excel">
            <input
                style={{ display: 'none' }}
                onChange={handleChange}
                disabled={disabled}
                id="upload-excel"
                name="upload-excel"
                type="file"
                accept=".xlsx"
            />
            <Button
                disabled={disabled}
                variant="contained"
                sx={{
                    color: '#727272',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    boxShadow: '0px 3px 6px #00000029',
                    ':hover': {
                        backgroundColor: '#EFEFEF',
                    },
                }}
                component="span"
                endIcon={<ExcelIcon />}
            >
                <Typography sx={{ fontWeight: 'bold' }} variant="button">
                    Excel
                </Typography>
            </Button>
        </label>
    );
};

export default ExcelButton;
