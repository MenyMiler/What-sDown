/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';
import React from 'react';
import { Genders } from '../../interfaces/room';
import { AreasService } from '../../services/areas';
import { BasesService } from '../../services/bases';
import { useUserStore } from '../../stores/user';
import { MultipleSort } from '../filterSelect/MultipleSort';
import SingleSort from './singleSort';
import { SortTypes } from './sorts.types';

interface ISingleResourceSortProps {
    setSort: (value: string | string[] | undefined) => void;
    sortType: SortTypes;
    isMultiple?: boolean;
}

const SingleResourceSort = ({ setSort, sortType, isMultiple }: ISingleResourceSortProps) => {
    const baseId = useUserStore(({ user }) => user.baseId);

    const { data } = useQuery({
        queryKey: [`sort-${sortType}`, baseId],
        queryFn: () => {
            switch (sortType) {
                case SortTypes.BUILDING:
                    return BasesService.getBuildings(baseId);
                case SortTypes.AREA:
                    return AreasService.getByQuery({ baseId });
                case SortTypes.NETWORKS:
                    return BasesService.getNetworks(baseId);
                case SortTypes.BRANCH:
                    return BasesService.getBranches(baseId);
                case SortTypes.GENDER:
                    return Object.values(Genders).map((gender) => ({ _id: gender, name: i18next.t(`common.genders.${gender}`) }));
                default:
                    throw new Error(i18next.t('resourceManagement.errors.sort'));
            }
        },
        meta: { errorMessage: i18next.t('resourceManagement.errors.sort') },
    });
    const label = i18next.t(`common.${sortType}`);
    return isMultiple ? (
        <MultipleSort label={label} sortOptions={data || []} handleSort={setSort} />
    ) : (
        <SingleSort label={label} sortOptions={data || []} handleSort={setSort} />
    );
};

export default SingleResourceSort;
