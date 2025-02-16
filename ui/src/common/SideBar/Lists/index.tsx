import {
    AddBoxOutlined,
    AdminPanelSettings,
    Construction,
    ManageAccounts,
    ManageSearch,
    PlaylistAddCheck,
    QuestionAnswerOutlined,
    RecentActors,
    School,
} from '@mui/icons-material';
import i18next from 'i18next';
import React from 'react';
import { environment } from '../../../globals';
import { useUserStore } from '../../../stores/user';
import { hasPermission } from '../../../utils/ProtectedRoutes';
import ModalListItem from '../../Modals';
import { addAdminsRequestModal } from '../../Modals/admins';
import { ListsWrapper } from '../SideBar.styled';
import List from './List';
import ListItem, { IList } from './List/ListItem';
import {
    courseManagementListItems,
    courseRequestsListItems,
    humanResourcesManagementListItems,
    resourceEventsRequestsListItems,
    resourceManagementListItems,
    resourceRequestsListItems,
} from './ListItems';

const { permissions } = environment;

interface ISidebarListsProps {
    handleDrawerOpen: () => void;
    handleOnClickEvent: () => void;
    currTextIdentifier: string;
    setCurrTextIdentifier: React.Dispatch<React.SetStateAction<string>>;
    sideBarRenderSwitch: boolean;
}

const SidebarLists = ({
    handleDrawerOpen,
    handleOnClickEvent,
    currTextIdentifier,
    setCurrTextIdentifier,
    sideBarRenderSwitch,
}: ISidebarListsProps) => {
    const currentUser = useUserStore(({ user }) => user);

    const renderList = (Icon: React.ElementType, text: string, items: IList[], nestedItems?: IList[], nestedItemsName?: string) => (
        <List
            Icon={Icon}
            text={i18next.t(text)}
            items={items}
            handleDrawerOpen={handleDrawerOpen}
            handleOnClickEvent={handleOnClickEvent}
            setCurrTextIdentifier={setCurrTextIdentifier}
            currTextIdentifier={currTextIdentifier}
            sideBarRenderSwitch={sideBarRenderSwitch}
        >
            {nestedItems && (
                <List
                    Icon={Icon}
                    text={i18next.t(nestedItemsName as string)}
                    items={nestedItems}
                    handleDrawerOpen={handleDrawerOpen}
                    handleOnClickEvent={handleOnClickEvent}
                    setCurrTextIdentifier={setCurrTextIdentifier}
                    currTextIdentifier={currTextIdentifier}
                    sideBarRenderSwitch={sideBarRenderSwitch}
                />
            )}
        </List>
    );

    return (
        <ListsWrapper>
            {renderList(
                AddBoxOutlined,
                'sideBar.resourceRequests.createRequestForResource',
                resourceRequestsListItems,
                resourceEventsRequestsListItems,
                'sideBar.relatedCourseRequests.relatedCourse',
            )}
            {renderList(AddBoxOutlined, 'sideBar.courseRequests.createRequestForCourse', courseRequestsListItems)}
            {renderList(Construction, 'sideBar.resourceManagement.manageResources', resourceManagementListItems)}
            {renderList(School, 'sideBar.courseManagement.manageCourses', courseManagementListItems)}
            {renderList(RecentActors, 'sideBar.humanResources.title', humanResourcesManagementListItems)}

            {hasPermission(permissions.resourceManager, currentUser) && (
                <ListItem
                    Icon={ManageAccounts}
                    text="sideBar.resources"
                    to="/resources"
                    allowedUsers={permissions.resourceManager}
                    setCurrTextIdentifier={setCurrTextIdentifier}
                    currTextIdentifier={currTextIdentifier}
                    handleOnClickEvent={handleOnClickEvent}
                    sideBarRenderSwitch={sideBarRenderSwitch}
                />
            )}

            <ListItem
                Icon={PlaylistAddCheck}
                text="sideBar.requestsManagement"
                to="/requests"
                allowedUsers={permissions.allWithBasicUser}
                setCurrTextIdentifier={setCurrTextIdentifier}
                currTextIdentifier={currTextIdentifier}
                handleOnClickEvent={handleOnClickEvent}
                sideBarRenderSwitch={sideBarRenderSwitch}
            />

            {hasPermission(permissions.superadmin, currentUser) && (
                <ListItem
                    Icon={QuestionAnswerOutlined}
                    text="sideBar.feedbackManagement"
                    to="/feedbacks"
                    allowedUsers={permissions.superadmin}
                    setCurrTextIdentifier={setCurrTextIdentifier}
                    currTextIdentifier={currTextIdentifier}
                    handleOnClickEvent={handleOnClickEvent}
                    sideBarRenderSwitch={sideBarRenderSwitch}
                />
            )}

            {hasPermission(permissions.planning, currentUser) && (
                <ModalListItem
                    Icon={AdminPanelSettings}
                    text={i18next.t('sideBar.courseManagement.auth')}
                    ModalContent={addAdminsRequestModal}
                    setCurrTextIdentifier={setCurrTextIdentifier}
                    currTextIdentifier={currTextIdentifier}
                    sideBarRenderSwitch={sideBarRenderSwitch}
                />
            )}
            {hasPermission(permissions.superadmin, currentUser) && currentUser.isDeveloper && (
                <ListItem
                    Icon={ManageSearch}
                    text="sideBar.activityLogs"
                    to="/activityLogs"
                    allowedUsers={permissions.superadmin}
                    setCurrTextIdentifier={setCurrTextIdentifier}
                    currTextIdentifier={currTextIdentifier}
                    handleOnClickEvent={handleOnClickEvent}
                    sideBarRenderSwitch={sideBarRenderSwitch}
                />
            )}
        </ListsWrapper>
    );
};

export default SidebarLists;
