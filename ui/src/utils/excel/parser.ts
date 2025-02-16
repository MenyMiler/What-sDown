import i18next from 'i18next';
import _ from 'lodash';
import { toast } from 'react-toastify';
import readXlsxFile from 'read-excel-file';
import { tableCategories } from '../../common/Modals/newResourceModal/info/tableData';
import hebrew from '../../i18n/hebrew';
import { Genders, SpecialStudentTypes } from '../../interfaces/soldier';
import { Categories, annualGraphCategories, i18TranslateCategories, studentCategories } from './categories';

const genders = Object.values(Genders);
const studentTypes = Object.values(SpecialStudentTypes);
const yesNoTypes = [true, false];
const courseTypes = Object.keys(hebrew.common.typesOnlyForExcel);
const roomTypes = Object.keys(hebrew.common.roomTypesOnlyForExcel);
enum specialCategories {
    gender = 'gender',
    studentType = 'studentType',
    disabled = 'disabled',
    isStaff = 'isStaff',
    networks = 'networks',
    network = 'network',
    courseType = 'courseType',
    type = 'type',
    exceptional = 'exceptional',
}

const dataValidation = (excelRows: string[][], rowsCategories: Categories) => {
    const [headersRow] = excelRows;
    if (headersRow.length !== rowsCategories.length) throw new Error('invalidNumberOfCategories');
    if (excelRows.every((row) => row.every((cell) => !cell))) throw new Error('invalidDataInCells');
    if (_.uniq(headersRow).length !== headersRow.length) throw new Error('duplicateCategories');
};

const findSpecialTypes = (specialTypes: (string | boolean)[], i18Path: string, hebrewTranslation?: string): string | boolean => {
    if (!hebrewTranslation) return '';

    const result = specialTypes.find((category) => hebrewTranslation === i18next.t(`${i18Path}${category.toString()}`));

    // ? checking for undefined specifically, because result can be false
    if (result === undefined) throw new Error('invalidDataInCells');
    return result!;
};

const getNetworksFromManyNetworksString = (row: string | null): { name: string; amount: number }[] => {
    if (!row) return [];

    return row.split(',').map((network) => {
        const [name, amount] = network.split(':');

        return { name: name.trim(), amount: Number(amount.trim()) };
    });
};

const getRowCategories = (categoryType: string) => {
    switch (categoryType) {
        case i18TranslateCategories.i18TranslateAnnualGraphCategories:
            return annualGraphCategories;
        case i18TranslateCategories.i18TranslateStudentCategories:
            return studentCategories;
        case i18TranslateCategories.i18TranslateAreasCategories:
            return tableCategories.area;
        case i18TranslateCategories.i18TranslateBuildingsCategories:
            return tableCategories.building;
        case i18TranslateCategories.i18TranslateFloorsCategories:
            return tableCategories.floor;
        case i18TranslateCategories.i18TranslateRoomsCategories:
            return tableCategories.room;
        default:
            toast.error(i18next.t('excelCategories.errors.invalidCategory'));
            return [];
    }
};

const excelParser = async (file: File, categoryType: string) => {
    const rows = (await readXlsxFile(file)) as string[][];
    const rowCategories = getRowCategories(categoryType);

    dataValidation(rows, rowCategories);

    const categories = rows[0].map((cell) => rowCategories.find((category) => cell === i18next.t(`excelCategories.${categoryType}.${category}`)));

    rows.splice(0, 1);

    const data = rows
        .filter((row) => row.some((cell) => cell))
        .map((row) => {
            const properties: any = {};
            categories.forEach((category, index) => {
                switch (category) {
                    case specialCategories.gender:
                        properties[category as string] = findSpecialTypes(genders, 'common.genders.', row[index]);
                        break;
                    case specialCategories.studentType:
                        properties[category as string] = findSpecialTypes(studentTypes, 'excel.exportExcel.specialStudentType.', row[index]);
                        break;
                    case specialCategories.disabled:
                        properties[category as string] = findSpecialTypes(yesNoTypes, 'excelCategories.disable.', row[index]);
                        break;
                    case specialCategories.isStaff:
                        properties[category as string] = findSpecialTypes(yesNoTypes, 'excelCategories.isStaff.', row[index]);
                        break;
                    case specialCategories.networks:
                        properties[category as string] = getNetworksFromManyNetworksString(row[index]);
                        break;
                    case specialCategories.exceptional:
                        properties[category as string] = findSpecialTypes(yesNoTypes, 'excelCategories.exceptional.', row[index]);
                        break;
                    case specialCategories.type:
                    case specialCategories.courseType:
                        if (categoryType === i18TranslateCategories.i18TranslateRoomsCategories) {
                            properties[category as string] = findSpecialTypes(roomTypes, 'common.roomTypes.', row[index]);
                        } else properties[category as string] = findSpecialTypes(courseTypes, 'common.types.', row[index]);
                        break;
                    default:
                        properties[category as string] = row[index];
                }
            });

            return properties;
        });
    if (file.name) {
        localStorage.setItem('excelName', file.name); // Update localStorage whenever excelName changes
    }
    return data;
};

export default excelParser;
