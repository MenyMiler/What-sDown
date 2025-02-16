import { useQueries } from '@tanstack/react-query';
import i18next from 'i18next';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectElement, TextFieldElement } from 'react-hook-form-mui';
import * as yup from 'yup';
import { Types } from '../../../../interfaces/courseTemplate';
import { RequestTypes } from '../../../../interfaces/request';
import { BasesService } from '../../../../services/bases';
import { NetworksService } from '../../../../services/networks';
import { requiredString } from '../../../../utils/yup';
import SnackBar from '../../SnackBar';
import { GridWrapper } from '../../modals.styled';

const baseInfoSchema = yup.object({
    branchId: requiredString,
    baseId: requiredString,
    unit: requiredString,
    networkId: requiredString,
    type: requiredString,
});

const BaseInfo = () => {
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
    const watchBaseId: string | undefined = watch('baseId');

    const branches = useMemo(() => {
        if (!watchBaseId) return [];
        const currentBase = bases.find((base) => base._id === watchBaseId);
        return currentBase ? currentBase.branches : [];
    }, [bases, watchBaseId]);

    return (
        <GridWrapper container>
            <SnackBar isNextSteps requestType={RequestTypes.NEW_COURSE_TEMPLATE} />
            <SelectElement
                name="baseId"
                label={i18next.t('common.baseName')}
                options={bases.map((base) => ({ id: base._id, label: base.name }))}
                required
            />
            {branches && (
                <SelectElement
                    name="branchId"
                    label={i18next.t('common.branch')}
                    options={branches.map(({ _id, name }) => ({ id: _id, label: name }))}
                    required
                />
            )}
            <SelectElement
                name="networkId"
                label={i18next.t('common.network')}
                options={networks.map(({ _id, name }) => ({ id: _id, label: name }))}
                required
            />
            <TextFieldElement name="unit" label={i18next.t('common.unit')} required />
            <SelectElement
                name="type"
                label={i18next.t('common.type')}
                options={Object.values(Types).map((type) => ({ id: type, label: i18next.t(`common.types.${type}`) }))}
                required
            />
        </GridWrapper>
    );
};

export { BaseInfo, baseInfoSchema };
