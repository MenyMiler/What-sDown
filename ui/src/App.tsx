import { CircularProgress } from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import _ from 'lodash';
import React, { useMemo } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Main from './Main';
import { AuthService } from './services/authService';
import { BasesService } from './services/bases';
import { NetworksService } from './services/networks';
import { UsersService } from './services/users';
import { useUserStore } from './stores/user';
// import Loading from './loading';

const App = () => {
    const currentUser = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const initUser = async () => {
        const user = AuthService.getUser();
        if (!user) return;

        let userInfoFromDb = {};

        try {
            const userFromDb = await UsersService.getUserPermissions(user.genesisId);

            const baseIdFromLocalStorage = localStorage.getItem('baseId');

            const { baseId, type: currentUserType } =
                userFromDb.permissionByBase.find((permission) => permission.baseId === baseIdFromLocalStorage) || userFromDb.permissionByBase[0];
            userInfoFromDb = { ...userFromDb, baseId, currentUserType };
        } catch (error) {
            /* empty */
        }

        const newUser = { ...user, ...userInfoFromDb };

        if (!_.isEqual(currentUser, newUser)) setUser(newUser);

        return newUser; // eslint-disable-line consistent-return
    };

    const queryResults = useQueries({
        queries: [
            { queryKey: ['initUser'], queryFn: () => initUser(), refetchOnWindowFocus: true },
            { queryKey: ['bases'], queryFn: () => BasesService.getByQuery() },
            { queryKey: ['networks'], queryFn: () => NetworksService.getByQuery() },
        ].map((query) => ({ ...query, enabled: !!currentUser, gcTime: Infinity })),
    });

    const isLoading = useMemo(() => queryResults.some(({ isLoading: isLoadingQuery }) => isLoadingQuery), [queryResults]);

    if (isLoading) {
        // return <Loading />;
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30vh' }}>
                <CircularProgress size={80} />
            </div>
        );
    }

    // if (!currentUser) {
    //     return <span>unauthorized</span>;
    // }

    return <Main />;
};

export default App;
