import React from 'react';
import { UploadFile } from '@mui/icons-material';
import i18next from 'i18next';
import { IconButtonWithTooltip } from '../../../common/IconButtonWithTooltip';

interface IUploadExcelButtonProps {
    onClick: () => void;
}

export const UploadExcelButton = ({ onClick }: IUploadExcelButtonProps) => (
    <IconButtonWithTooltip iconButtonProps={{ onClick }} popoverText={i18next.t('resources.uploadExcel')}>
        <UploadFile fontSize="medium" />
    </IconButtonWithTooltip>
);
