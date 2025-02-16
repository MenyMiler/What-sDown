/* eslint-disable no-plusplus */
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import i18next from 'i18next';
import { PopulatedFeedbackForExcel } from '../../../interfaces/feedback';

type IExcelExportFeedbacksKeys = keyof PopulatedFeedbackForExcel;
const categories: IExcelExportFeedbacksKeys[] = ['name', 'job', 'createdAt', 'urgency', 'category', 'description', 'rating', 'seen'];

const excelExporter = async (data: PopulatedFeedbackForExcel[]) => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(i18next.t('feedbackManagementPage.excel.title'), {
        pageSetup: { paperSize: 9, orientation: 'landscape' },
    });

    const row = ws.addRow(categories.map((category) => i18next.t(`feedbackManagementPage.${category}`)));
    row.font = { bold: true };

    data.forEach((feedback) => {
        ws.addRow(categories.map((category) => feedback[category]));
    });

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `${i18next.t('feedbackManagementPage.excel.title')}.xlsx`);
};

export default excelExporter;
