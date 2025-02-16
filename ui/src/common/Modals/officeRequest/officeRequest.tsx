import i18next from 'i18next';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { environment } from '../../../globals';
import { PopulatedCourse } from '../../../interfaces/course';
import { NetworkDocument } from '../../../interfaces/network';
import { RequestTypes } from '../../../interfaces/request';
import { setValues } from '../../../utils/wizard';
import { minMax, requiredString } from '../../../utils/yup';
import CourseSearch from '../CourseSearch';
import DateField from '../DateField';
import SnackBar from '../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../modals.styled';

const { magicWidth } = environment;

const basicInfoSchema = yup.object({
    courseId: requiredString,
    amount: minMax(1),
    comments: yup.string(),
    networkId: requiredString,
});

const values = {
    branch: '',
    startDate: new Date(),
    endDate: new Date(),
};

const OfficeRequest = () => {
    const { setValue } = useFormContext();
    const [displaySavedData, setDisplaySavedData] = useState(false);
    const [networks, setNetworks] = useState<NetworkDocument[]>([]);

    const setDisabledTextFields = async (currentCourse: PopulatedCourse) => {
        setNetworks(currentCourse.networks);
        setValues<typeof values>(
            {
                branch: currentCourse.branch.name,
                startDate: currentCourse.startDate,
                endDate: currentCourse.endDate,
            },
            setValue,
        );
    };

    return (
        <GridWrapper container>
            <SnackBar setDisplaySavedData={setDisplaySavedData} requestType={RequestTypes.NEW_OFFICE} />
            <CourseSearch displaySavedData={displaySavedData} setDisabledTextFields={setDisabledTextFields} values={values} />

            <GridWithMultipleItems container>
                <TextFieldElement name="branch" label={i18next.t('common.branch')} disabled />
                <SelectElement
                    name="networkId"
                    sx={{ width: magicWidth }}
                    label={i18next.t('common.network')}
                    options={networks.map(({ _id: id, name: label }) => ({ id, label }))}
                    disabled={!networks.length}
                    required
                />
            </GridWithMultipleItems>

            <GridWithMultipleItems container>
                <DateField name="startDate" label={i18next.t('common.startDate')} sx={{ width: magicWidth }} disabled />
                <DateField name="endDate" label={i18next.t('common.endDate')} sx={{ width: magicWidth }} disabled />
            </GridWithMultipleItems>

            <GridWithMultipleItems container>
                <TextFieldElement
                    name="amount"
                    label={i18next.t('wizard.addFacilityRequest.peopleAmount')}
                    type="number"
                    inputProps={{ min: 1 }}
                    required
                />
                <TextFieldElement name="comments" label={i18next.t('wizard.addFacilityRequest.comment')} />
            </GridWithMultipleItems>
        </GridWrapper>
    );
};

export { OfficeRequest, basicInfoSchema };
