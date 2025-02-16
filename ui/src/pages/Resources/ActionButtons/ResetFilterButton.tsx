import React from 'react';
import { FilterListOffRounded } from '@mui/icons-material';
import i18next from 'i18next';
import { IconButtonWithTooltip } from '../../../common/IconButtonWithTooltip';
import { ITableRef } from '../Table';

interface IResetFilterButtonProps {
    tableRef: React.RefObject<ITableRef>;
}

export const ResetFilterButton = ({ tableRef }: IResetFilterButtonProps) => (
    <IconButtonWithTooltip iconButtonProps={{ onClick: () => tableRef.current?.resetFilter() }} popoverText={i18next.t('resources.resetFilters')}>
        <FilterListOffRounded fontSize="medium" />
    </IconButtonWithTooltip>
);
