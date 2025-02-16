/* eslint-disable consistent-return */
/* eslint-disable default-case */
import i18next from 'i18next';
import React, { useState } from 'react';
import { PopulatedFeedback, PopulatedFeedbackForExcel } from '../../../interfaces/feedback';
import { convertDateTolocaleString } from '../../../utils/today';
import ExcelButton from '../../yearlyGraph/excelButton';
import excelExporter from './excelExporter';

interface IExportExcelProps {
    disable: boolean;
    populatedFeedbacks: PopulatedFeedback[];
}

const ExportExcel = ({ disable, populatedFeedbacks }: IExportExcelProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    const saveFile = async () => {
        const excelData: PopulatedFeedbackForExcel[] = populatedFeedbacks.map((populatedFeedback) => {
            const { createdAt, urgency, category, description, rating, seen, name, job } = populatedFeedback;

            return {
                name,
                job,
                description,
                rating,
                urgency: i18next.t(`feedbackManagementPage.urgencyTypes.${urgency}`),
                category: i18next.t(`feedbackManagementPage.categoryTypes.${category}`),
                seen: i18next.t(`feedbackManagementPage.seenOptions.${seen}`) as string,
                createdAt: convertDateTolocaleString(createdAt).replaceAll('.', '/'),
            } as PopulatedFeedbackForExcel;
        });

        excelExporter(excelData);
        setLoading(false);
    };

    return <ExcelButton loading={loading} disabled={!disable} saveFile={saveFile} text={i18next.t('excel.exportExcel.export')} />;
};

export default ExportExcel;
