import { useQueries } from '@tanstack/react-query';
import i18next from 'i18next';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { environment } from '../../../../globals';
import { PopulatedBase } from '../../../../interfaces/base';
import { RequestTypes } from '../../../../interfaces/request';
import { BasesService } from '../../../../services/bases';
import { NetworksService } from '../../../../services/networks';
import { requiredString } from '../../../../utils/yup';
import SnackBar from '../../SnackBar';
import { GridWithMultipleItems, GridWrapper } from '../../modals.styled';

const { magicWidth } = environment;

const basicInfoSchema = yup.object({
    name: requiredString,
    courseACAId: requiredString,
    courseSAPId: yup.string(),
    profession: yup.string(),
    courseBaseId: requiredString,
    unit: requiredString,
    branchId: requiredString,
    networkId: requiredString,
});

const BasicInfo = () => {
    const [{ data: bases = [] }, { data: networks = [] }] = useQueries({
        queries: [
            {
                queryKey: ['bases'],
                queryFn: () => BasesService.getByQuery({ populate: true }),
                meta: { errorMessage: i18next.t('wizard.admins.errors.baseError') },
            },
            { queryKey: ['networks'], queryFn: () => NetworksService.getByQuery() },
        ],
    });

    const { watch } = useFormContext();
    const watchBaseId: string | undefined = watch('courseBaseId');

    const branches = useMemo(() => {
        if (!watchBaseId) return [];
        const currentBase = (bases as PopulatedBase[]).find((base) => base._id === watchBaseId);
        return currentBase && currentBase.branches ? currentBase.branches : [];
    }, [bases, watchBaseId]);

    return (
        <GridWrapper container>
            <SnackBar isNextSteps requestType={RequestTypes.NEW_COURSE} />
            <GridWithMultipleItems container>
                <TextFieldElement name="name" label={i18next.t('common.name')} required />
                <TextFieldElement name="courseACAId" label={i18next.t('common.courseACAId')} required />
            </GridWithMultipleItems>

            <GridWithMultipleItems container>
                <TextFieldElement name="courseSAPId" label={i18next.t('common.courseSAPId')} />
                <TextFieldElement name="profession" label={i18next.t('common.profession')} />
            </GridWithMultipleItems>

            <GridWithMultipleItems container>
                <SelectElement
                    name="courseBaseId"
                    label={i18next.t('wizard.createCourseTemplate.baseName')}
                    options={bases.map(({ _id: id, name: label }) => ({ id, label }))}
                    sx={{ width: magicWidth }}
                    required
                />

                <SelectElement
                    name="branchId"
                    label={i18next.t('common.branch')}
                    options={branches.map(({ _id: id, name: label }) => ({ id, label }))}
                    sx={{ width: magicWidth }}
                    disabled={!watchBaseId}
                    required
                />
            </GridWithMultipleItems>

            <GridWithMultipleItems container>
                <TextFieldElement name="unit" label={i18next.t('common.unit')} required />

                <SelectElement
                    name="networkId"
                    label={i18next.t('common.network')}
                    options={networks.map(({ _id, name }) => ({ id: _id, label: name }))}
                    sx={{ width: magicWidth }}
                    required
                />
            </GridWithMultipleItems>
        </GridWrapper>
    );
};

export { BasicInfo, basicInfoSchema };
