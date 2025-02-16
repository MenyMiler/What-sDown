/* eslint-disable react/require-default-props */
/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import React from 'react';
import { toast } from 'react-toastify';
import ExcelButton from '../../../pages/yearlyGraph/excelButton';
import { i18TranslateCategories } from '../../../utils/excel/categories';
import excelParser from '../../../utils/excel/parser';
import { ResourceTypes } from './importResources';

interface IImportManyProps {
    resourceType: ResourceTypes;
    disabled?: boolean;
    setData: React.Dispatch<React.SetStateAction<(string | boolean)[][]>>;
}

const getCategoriesByRequestType = (resourceType: ResourceTypes) => {
    switch (resourceType) {
        case ResourceTypes.AREA:
            return i18TranslateCategories.i18TranslateAreasCategories;
        case ResourceTypes.BUILDING:
            return i18TranslateCategories.i18TranslateBuildingsCategories;
        case ResourceTypes.FLOOR:
            return i18TranslateCategories.i18TranslateFloorsCategories;
        case ResourceTypes.ROOM:
            return i18TranslateCategories.i18TranslateRoomsCategories;
        default:
            throw new Error('category');
    }
};

export const context = React.createContext('');

const ImportManyButton = ({ resourceType, disabled, setData }: IImportManyProps) => {
    const handleUpload = async (event: any) => {
        const [file] = event.target.files;

        try {
            setData(await excelParser(file, getCategoriesByRequestType(resourceType)));
        } catch (err: any) {
            console.error('Error:', err);
            toast.error(i18next.t(`excelCategories.errors.${err.message}`));
        } finally {
            event.target.value = ''; // Clear file input value
        }
    };

    return <ExcelButton uploadFile={handleUpload} text={i18next.t('excel.importExcel.import')} disabled={disabled} />;
};

export default ImportManyButton;
