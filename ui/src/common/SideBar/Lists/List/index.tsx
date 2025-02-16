/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { OpenContext } from '../..';
import { useUserStore } from '../../../../stores/user';
import { hasPermission } from '../../../../utils/ProtectedRoutes';
import ListItem, { IList } from './ListItem';
import { environment } from '../../../../globals';

interface INestedListProps {
    Icon: any;
    text: string;
    items?: IList[];
    children?: any;
    handleDrawerOpen?: () => void;
    handleOnClickEvent: () => void;
    currTextIdentifier: string;
    setCurrTextIdentifier: React.Dispatch<React.SetStateAction<string>>;
    sideBarRenderSwitch: boolean;
}

const NestedList = ({
    Icon,
    text,
    items = [],
    children = [],
    handleDrawerOpen = () => {},
    handleOnClickEvent,
    currTextIdentifier,
    setCurrTextIdentifier,
    sideBarRenderSwitch,
}: INestedListProps) => {
    const isSideBarOpen = useContext(OpenContext);

    const [open, setOpen] = useState<boolean>(false);
    const [selectedList, setSelectedList] = useState<boolean>(false);

    const currentUser = useUserStore(({ user }) => user);
    const allowedItems = useMemo(() => items.filter(({ allowedUsers }) => hasPermission(allowedUsers, currentUser)), [currentUser.currentUserType]);

    const handleClick = () => {
        if (!isSideBarOpen) handleDrawerOpen();
        setCurrTextIdentifier(text);
        handleOnClickEvent();
        setOpen(!open);
    };

    useEffect(() => {
        if (!isSideBarOpen) setOpen(false);
    }, [isSideBarOpen]);

    useEffect(() => {
        const isTextIdentifier = currTextIdentifier === text;
        if (!isTextIdentifier) setCurrTextIdentifier('');
        setSelectedList(isTextIdentifier);
    }, [sideBarRenderSwitch]);

    return allowedItems.length || children.length ? (
        <>
            <ListItemButton onClick={handleClick} style={{ backgroundColor: selectedList ? environment.colors.sidebarHighlightColor : 'inherit' }}>
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit sx={{ pl: 4 }}>
                <List component="div" disablePadding>
                    {allowedItems.map((item, index) => (
                        <ListItem
                            key={index}
                            {...item}
                            handleOnClickEvent={handleOnClickEvent}
                            setCurrTextIdentifier={setCurrTextIdentifier}
                            currTextIdentifier={currTextIdentifier}
                            sideBarRenderSwitch={sideBarRenderSwitch}
                        />
                    ))}
                    {children}
                </List>
            </Collapse>
        </>
    ) : null;
};

NestedList.defaultProps = {
    items: [],
    children: [],
    handleDrawerOpen: () => {},
};

export default NestedList;
