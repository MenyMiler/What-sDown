import React from 'react';
import { AddCircleOutline } from '@mui/icons-material';
import i18next from 'i18next';
import { IconButtonWithTooltip } from '../../../common/IconButtonWithTooltip';

interface IAddResourceButtonProps {
    onClick: () => void;
}

export const AddResourceButton = ({ onClick }: IAddResourceButtonProps) => (
    <IconButtonWithTooltip iconButtonProps={{ onClick }} popoverText={i18next.t('resources.createResource')}>
        <AddCircleOutline fontSize="medium" />
    </IconButtonWithTooltip>
);
