/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
import { FilterAlt } from '@mui/icons-material';
import { Box } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import SingleResourceSort from './singleResourceSort';
import { SortObject, SortTypes } from './sorts.types';

interface IAllResourceSortsProps {
    setSortObject: Dispatch<SetStateAction<Partial<SortObject>>>;
    sortTypes: SortTypes[];
}

const AllResourceSorts = ({ setSortObject, sortTypes }: IAllResourceSortsProps) => (
    <Box sx={{ mb: '1rem', display: 'flex', alignItems: 'center' }}>
        <FilterAlt />
        {sortTypes.map((sortType, index) => {
            const setSort = (value: string | string[] | undefined) =>
                setSortObject((sortObject) => ({ ...sortObject, [sortType as SortTypes]: value }));
            const isMultiple = sortType === SortTypes.NETWORKS;

            return <SingleResourceSort key={index} sortType={sortType as SortTypes} isMultiple={isMultiple} setSort={setSort} />;
        })}
    </Box>
);

export default AllResourceSorts;
