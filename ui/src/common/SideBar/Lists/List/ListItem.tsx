import React, { useEffect, useState } from 'react';
import i18next from 'i18next';
import { Types as UserTypes } from '../../../../interfaces/user';
import ModalListItem from '../../../Modals';
import { IModalContent } from '../../../Modals/GenericModalForm';
import { StyledLink } from '../../SideBar.styled';
import BaseListItem, { IBaseListItemProps } from './BaseListItem';

interface IListItem extends IBaseListItemProps {
    allowedUsers: UserTypes[];
}

interface IListItemWithModal extends IListItem {
    ModalContent: IModalContent;
    to?: never;
}

interface IListItemWithLink extends IListItem {
    to: string;
    ModalContent?: never;
}

export type IList = IListItemWithModal | IListItemWithLink;

type IListItemProps = {
    handleOnClickEvent: () => void;
    currTextIdentifier: string;
    setCurrTextIdentifier: React.Dispatch<React.SetStateAction<string>>;
    sideBarRenderSwitch: boolean;
} & IList;

const ListItem = (props: IListItemProps) => {
    const { Icon, text, to, ModalContent, handleOnClickEvent, currTextIdentifier, setCurrTextIdentifier, sideBarRenderSwitch } = props;

    const handleClick = () => {
        handleOnClickEvent();
        setCurrTextIdentifier(i18next.t(text));
    };

    return to ? (
        <StyledLink to={to} onClick={handleClick}>
            <BaseListItem Icon={Icon} text={i18next.t(text)} sideBarRenderSwitch={sideBarRenderSwitch} currTextIdentifier={currTextIdentifier} />
        </StyledLink>
    ) : (
        <ModalListItem
            Icon={Icon}
            text={i18next.t(text)}
            ModalContent={ModalContent!}
            setCurrTextIdentifier={setCurrTextIdentifier}
            currTextIdentifier={currTextIdentifier}
            sideBarRenderSwitch={sideBarRenderSwitch}
        />
    );
};

export default ListItem;
