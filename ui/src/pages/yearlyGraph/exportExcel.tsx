/* eslint-disable consistent-return */
/* eslint-disable default-case */
import i18next from 'i18next';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import excelExporter from '../../utils/excel/exporter';
import { convertDateTolocaleString } from '../../utils/today';
import ExcelButton from './excelButton';
import { CoursesService } from '../../services/courses';
import { IExcelExportCourses } from '../../utils/excel/interface';
import { RoomTypes } from '../../interfaces/room';
import { useUserStore } from '../../stores/user';
import { mapperForName } from '../../utils/mapper';

interface IExportExcelProps {
    rowsCount: number;
}

const ExportExcel = ({ rowsCount }: IExportExcelProps) => {
    const currentUser = useUserStore(({ user }) => user);
    const [loading, setLoading] = useState<boolean>(false);

    const getRows = async () => {
        try {
            setLoading(true);
            return CoursesService.getByQuery({ sort: 'true', baseId: currentUser.baseId!, populate: true });
        } catch {
            toast.error(i18next.t('error.config'));
            return [];
        }
    };

    const saveFile = async () => {
        const populatedCourses = await getRows();

        const excelData: IExcelExportCourses[] = populatedCourses.map((course) => {
            const { OFFICE, CLASS } = RoomTypes;

            const { offices, classes } = course.rooms.reduce(
                (accumulator, { type, name }) => {
                    if (type === OFFICE) {
                        accumulator.offices.push(name);
                    } else if (type === CLASS) {
                        accumulator.classes.push(name);
                    }
                    return accumulator;
                },
                { offices: [] as string[], classes: [] as string[] },
            );

            const conditionalFields: any = {};

            if (course.bootCamp.startDate)
                conditionalFields.basicTrainingStartDate = convertDateTolocaleString(course.bootCamp.startDate).replaceAll('.', '/');

            if (course.bootCamp.endDate)
                conditionalFields.basicTrainingEndDate = convertDateTolocaleString(course.bootCamp.endDate).replaceAll('.', '/');

            if (course.receivanceDate) conditionalFields.receivanceDate = convertDateTolocaleString(course.receivanceDate).replaceAll('.', '/');

            if (course.enlistmentDate) conditionalFields.enlistmentDate = convertDateTolocaleString(course.enlistmentDate).replaceAll('.', '/');

            return {
                courseName: course.name,
                branch: course.branch.name,
                networks: mapperForName(course.networks).join(', '),
                courseType: i18next.t(`common.types.${course.type}`),
                courseACAId: course.courseACAId,
                baseName: course.base.name,
                year: course.year,
                startDate: convertDateTolocaleString(course.startDate).replaceAll('.', '/'),
                endDate: convertDateTolocaleString(course.endDate).replaceAll('.', '/'),
                unit: course.unit,
                courseSAPId: course.courseSAPId,
                profession: course.profession,
                RAKAZCourseDuration: course.durations.rakaz,
                actualCourseDuration: course.durations.actual,
                ...conditionalFields,
                bedrooms: mapperForName(course.rooms).join(','),
                classes: classes.join(','),
                offices: offices.join(','),
                iturMale: course.soldierAmounts.MALE,
                iturFemale: course.soldierAmounts.FEMALE,
                specialMale: course.soldierAmounts.SPECIAL_MALE,
                specialFemale: course.soldierAmounts.SPECIAL_FEMALE,
                totalMale: course.soldierAmounts.MALE + course.soldierAmounts.SPECIAL_MALE,
                totalFemale: course.soldierAmounts.FEMALE + course.soldierAmounts.SPECIAL_FEMALE,
            };
        });

        excelExporter(excelData);
        setLoading(false);
    };

    return <ExcelButton loading={loading} disabled={!rowsCount} saveFile={saveFile} text={i18next.t('excel.exportExcel.export')} />;
};

export default ExportExcel;
