import React from 'react';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useUserStore } from '../../stores/user';

const ChangeBase = () => {
    const { user: currentUser, setUser } = useUserStore((state) => state);

    const handleChange = ({ target: { value: newBaseId } }: SelectChangeEvent) => {
        setUser({
            ...currentUser,
            baseId: newBaseId,
            currentUserType: currentUser.permissionByBase.find(({ baseId }) => baseId === newBaseId)!.type,
        });
    };

    return (
        currentUser.bases.length && (
            <FormControl sx={{ width: 150, backgroundColor: 'linear-gradient(180deg, #5583F3, #B7CCFF)' }}>
                <Select
                    value={currentUser.bases.find(({ _id }) => _id === currentUser.baseId)!._id}
                    onChange={handleChange}
                    sx={{ borderRadius: '1.5rem', border: '0px solid #E7E8EA', backgroundColor: 'white', height: '3.1rem', my: '0.5rem' }}
                    MenuProps={{ PaperProps: { sx: { borderRadius: '10px', marginTop: '0.2rem' } } }}
                >
                    {currentUser.bases.map(({ _id, name }) => (
                        <MenuItem key={_id} value={_id} sx={{ minWidth: 120 }}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
    );
};

export default ChangeBase;
