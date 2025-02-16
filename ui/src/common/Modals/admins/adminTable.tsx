/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Autocomplete,
    CircularProgress,
    IconButton,
    LinearProgress,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import { Types as UserTypes } from '../../../interfaces/user';
import { StyledTableCell, StyledTableContainer } from './table.styled';
// import { environment } from '../../../globals';
import { KartoffelUser } from '../../../interfaces/kartoffel';
import { KartoffelService } from '../../../services/kartoffel';
import { UsersService } from '../../../services/users';

const tableCategories = ['name', 'personalNumber', ''];

const AdminsTable = () => {
    const [users, setUsers] = useState<KartoffelUser[]>([]);
    const [hasMore, _setHasMore] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    // const [step, setStep] = useState<number>(0);

    const [searchedPeople, setSearchedPeople] = useState<KartoffelUser[]>([]);
    const [text, setText] = useState<string>('');
    const [autoDisabled, setAutoDisabled] = useState<boolean>(true);

    const { watch } = useFormContext();
    const baseId: string | undefined = watch('base');
    const userType: string | undefined = watch('userType');

    const init = () => {
        // setStep(0);
        setUsers([]);
        // setHasMore(false);
    };

    const getUsers = async () => {
        try {
            setLoading(true);

            // const populatedUsers = await UserService.getUsers({ baseId, limit: environment.pagination.limit, step, userType });
            const populatedUsers = await UsersService.getByQuery({ baseId, type: userType as UserTypes }, true);

            if (!populatedUsers.length) {
                init();
                setLoading(false);
                return;
            }

            setUsers(populatedUsers.map(({ kartoffelUser }) => kartoffelUser));
            // setStep((currStep) => currStep + 1);
            // setHasMore(true);
        } catch (error) {
            toast.error(i18next.t('wizard.admins.errors.userError'));
        }

        setLoading(false);
    };

    useEffect(() => {
        init();
        if (baseId && userType) getUsers();
        setAutoDisabled(!(baseId && userType));
    }, [baseId, userType]);

    const removeAdminFromBase = async (adminId: string) => {
        try {
            await UsersService.deleteOneByGenesisIdAndBaseId(adminId, baseId!);
            toast.success(i18next.t('wizard.admins.success.delete'));
            init();
            getUsers();
        } catch (error) {
            toast.error(i18next.t('wizard.admins.errors.userDeleteErr'));
        }
    };

    const createUser = async ({ id: genesisId }: KartoffelUser) => {
        try {
            await UsersService.createOne({ baseId: baseId!, genesisId, type: userType as UserTypes }, false);
            toast.success(i18next.t('wizard.admins.success.add'));
            init();
            getUsers();
        } catch (error) {
            toast.error(i18next.t('wizard.admins.errors.creationError'));
        }
    };

    const getFullName = (person: KartoffelUser) => person.fullName ?? `${person.firstName} ${person.lastName}`;
    const getName = (person: KartoffelUser) => person.displayName ?? getFullName(person);

    return (
        <>
            <Autocomplete
                freeSolo
                disableClearable
                options={searchedPeople}
                loading={autocompleteLoading}
                isOptionEqualToValue={(option, value) => option === value}
                onInputChange={_.debounce(async (_e, value) => {
                    setAutocompleteLoading(true);
                    setSearchedPeople(await KartoffelService.searchUserByName(value));
                    setAutocompleteLoading(false);
                }, 500)}
                getOptionLabel={(option: any) => getName(option)}
                inputValue={text}
                onChange={(_e, value) => {
                    if (!value) return;
                    setText('');
                    createUser(value as KartoffelUser);
                }}
                disabled={autoDisabled}
                renderInput={(params) => (
                    <TextField
                        key="textBoxAutocomplete"
                        placeholder={i18next.t('wizard.admins.kartoffel')}
                        value={text}
                        onChange={({ target: { value } }) => setText(value)}
                        autoFocus
                        {...params} // eslint-disable-line react/jsx-props-no-spreading
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />

            <InfiniteScroll scrollableTarget="table" next={getUsers} hasMore={hasMore} loader={undefined} dataLength={5}>
                <StyledTableContainer id="table">
                    <Table stickyHeader sx={{ minWidth: '100%' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {tableCategories.map((category) => (
                                    <StyledTableCell key={category}> {i18next.t(category ? `wizard.admins.table.${category}` : '')}</StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>{getFullName(user)}</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>{user.personalNumber ?? '-'}</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>
                                        <IconButton onClick={() => removeAdminFromBase(user.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {loading ? (
                        <LinearProgress />
                    ) : !users.length ? (
                        <Typography sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '1rem' }}>{i18next.t('noData')}</Typography>
                    ) : null}
                </StyledTableContainer>
            </InfiniteScroll>
        </>
    );
};

export default AdminsTable;
