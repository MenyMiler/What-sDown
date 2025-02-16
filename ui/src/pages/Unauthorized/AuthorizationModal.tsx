import React, { useEffect, useState } from 'react';
import { Backdrop, Box, Button, Fade, FormControl, InputLabel, MenuItem, Modal, Select } from '@mui/material';
import i18next from 'i18next';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Types as UserTypes } from '../../interfaces/user';
import { RequestTypes } from '../../interfaces/request';
import { PermissionRequestMetadata } from '../../interfaces/request/metadata';
import { environment } from '../../globals';
import { BasesService } from '../../services/bases';
import { RequestsService } from '../../services/requests';
import { UsersService } from '../../services/users';
import { useUserStore } from '../../stores/user';

const { magicWidth } = environment;
interface IAuthorizationModalProps {
    open: boolean;
    handleClose: () => void;
}

const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: '0px 3px 6px #00000029',
    p: 4,
    outlineStyle: 'none',
};

const AuthorizationModal = (props: IAuthorizationModalProps) => {
    const currentUser = useUserStore(({ user }) => user);
    const navigate = useNavigate();
    const { open, handleClose } = props;
    const [requestedUserType, setRequestedUserType] = useState('');
    const [baseId, setBaseId] = useState<string>('');

    const { data: bases } = useQuery({
        queryKey: ['bases'],
        queryFn: () => BasesService.getByQuery(),
        meta: { errorMessage: i18next.t('wizard.admins.errors.baseError') },
        initialData: [],
    });

    const handleSendRequest = async (_event: any) => {
        try {
            const user = await UsersService.createOne({ genesisId: currentUser.genesisId!, baseId, type: UserTypes.BASIC_USER }, false);

            await RequestsService.createOne({
                baseId,
                requesterId: user.genesisId as string,
                type: RequestTypes.PERMISSION,
                metaData: { currentUserType: UserTypes.BASIC_USER, requestedUserType } as PermissionRequestMetadata,
            });
        } catch {
            toast.error(i18next.t('wizard.error'));
            return;
        }

        toast.success(i18next.t('unauthorized.modal.requestSent'));

        navigate('/');
        window.location.reload();
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <FormControl sx={{ width: 200, backgroundColor: 'white' }}>
                        <InputLabel id="label">{i18next.t('unauthorized.modal.label')}</InputLabel>
                        <Select
                            labelId="label"
                            label={i18next.t('unauthorized.modal.label')}
                            value={requestedUserType}
                            onChange={(e: any) => setRequestedUserType(e.target.value)}
                        >
                            {Object.keys(UserTypes)
                                .filter((type) => type !== UserTypes.BASIC_USER)
                                .map((type, index) => (
                                    <MenuItem key={index.toString() as string} value={type} sx={{ width: magicWidth, minWidth: 200 }}>
                                        {i18next.t(`userTypes.${type}`)}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: 200, backgroundColor: 'white', marginTop: 3 }}>
                        <InputLabel id="label">{i18next.t('sideBar.bases.base')}</InputLabel>
                        <Select
                            labelId="label"
                            label={i18next.t('sideBar.bases.base')}
                            value={baseId}
                            onChange={(e: any) => setBaseId(e.target.value)}
                        >
                            {bases.map((b, index) => (
                                <MenuItem key={index.toString() as string} value={b._id} sx={{ minWidth: 150 }}>
                                    {b.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button disabled={!requestedUserType || !baseId} sx={{ mt: '2rem' }} onClick={handleSendRequest}>
                        {i18next.t('unauthorized.modal.sendRequest')}
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AuthorizationModal;
