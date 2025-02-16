import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { environment } from '../../../../globals';

export interface IBaseListItemProps {
    Icon: any;
    text: string;
    onClick?: (textIdentifier: string) => void;
    selected?: boolean;
    sideBarRenderSwitch?: boolean;
    currTextIdentifier?: string;
}

const BaseListItem = (props: IBaseListItemProps) => {
    const { Icon, text, onClick, selected, sideBarRenderSwitch, currTextIdentifier } = props;
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        if (onClick) onClick(text);
    };

    useEffect(() => {
        if (currTextIdentifier !== text) setIsClicked(false);
    }, [selected, sideBarRenderSwitch]);

    return (
        <ListItemButton
            onClick={handleClick}
            sx={{
                overflowX: 'hidden',
                backgroundColor: isClicked ? environment.colors.sidebarHighlightColor : 'inherit',
            }}
        >
            <ListItemIcon>
                <Icon />
            </ListItemIcon>
            <ListItemText primary={text} />
        </ListItemButton>
    );
};

BaseListItem.defaultProps = {
    onClick: () => {},
    selected: false,
    sideBarRenderSwitch: false,
    currTextIdentifier: '',
};

export default BaseListItem;
