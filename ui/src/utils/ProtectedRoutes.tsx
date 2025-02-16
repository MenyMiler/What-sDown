import React, { isValidElement } from 'react';
import { Navigate } from 'react-router-dom';
import { Types as UserTypes } from '../interfaces/user';
import { UserState, useUserStore } from '../stores/user';

const protectedRoute = (children: React.ReactNode, isAllowed: boolean) => {
    if (!isAllowed) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (isValidElement(children)) {
        return children;
    }

    return <div />;
};

interface ProtectedRouteProps {
    allowedUsers: UserTypes[];
    children: React.ReactNode;
}

interface ProtectActivityLogsProps {
    isDeveloper: boolean;
    allowedUsers: UserTypes[];
    children: React.ReactNode;
}

export const hasPermission = (permissions: UserTypes[], { currentUserType }: Partial<UserState['user']>) => permissions.includes(currentUserType!);
export const ProtectActivityLogs: React.FC<ProtectActivityLogsProps> = ({ children, allowedUsers, isDeveloper }) => {
    const currentUser = useUserStore(({ user }) => user);
    return protectedRoute(children, isDeveloper && hasPermission(allowedUsers, currentUser));
};
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedUsers }) => {
    const currentUser = useUserStore(({ user }) => user);
    return protectedRoute(children, hasPermission(allowedUsers, currentUser));
};
