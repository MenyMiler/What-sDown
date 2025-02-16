/* eslint-disable no-plusplus */
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import i18next from 'i18next';
import { IExcelExportCourses } from './interface';

type IExcelExportCoursesKeys = keyof IExcelExportCourses;
const categories: IExcelExportCoursesKeys[] = [
    'courseACAId',
    'year',
    'courseType',
    'branch',
    'baseName',
    'unit',
    'courseSAPId',
    'profession',
    'courseName',
    'RAKAZCourseDuration',
    'actualCourseDuration',
    'basicTrainingStartDate',
    'basicTrainingEndDate',
    'receivanceDate',
    'startDate',
    'endDate',
    'enlistmentDate',
    'networks',
    'iturMale',
    'iturFemale',
    'specialMale',
    'specialFemale',
    'totalMale',
    'totalFemale',
];

const excelExporter = async (data: IExcelExportCourses[]) => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(i18next.t('excel.exportExcel.courseTitle'), {
        pageSetup: { paperSize: 9, orientation: 'landscape' },
    });

    const row = ws.addRow(categories.map((category) => i18next.t(`excelCategories.annualGraphCategories.${category}`)));
    row.font = { bold: true };

    data.forEach((course) => {
        ws.addRow(categories.map((category) => course[category]));
    });

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `${i18next.t('excel.exportExcel.courseTitle')}.xlsx`);
};

export default excelExporter;
