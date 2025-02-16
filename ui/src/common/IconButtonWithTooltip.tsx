/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import React, { CSSProperties } from 'react';
import { IconButton, Tooltip } from '@mui/material';

interface IIconButtonWithTooltipProps {
    iconButtonProps: React.ComponentProps<typeof IconButton>;
    popoverText: string;
    disabledToolTip?: boolean;
    style?: CSSProperties;
    children?: React.ReactNode;
}

export const IconButtonWithTooltip = ({ iconButtonProps, popoverText, disabledToolTip = false, style, children }: IIconButtonWithTooltipProps) => (
    <Tooltip title={popoverText} disableHoverListener={disabledToolTip} arrow>
        <span>
            <IconButton {...iconButtonProps} style={style}>
                {children}
            </IconButton>
        </span>
    </Tooltip>
);
