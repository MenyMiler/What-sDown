/* eslint-disable react/no-array-index-key */
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ResourceState from '../../common/resources/resourceState';
import { FullCardStyled } from '../../common/resources/styled';
import { RoomWithCapacity } from '../../interfaces/room';

interface ISelectedProps {
    rooms: RoomWithCapacity[];
    handleRemoveRoom: (room: RoomWithCapacity) => Promise<void>;
}

const SelectedResources = ({ rooms, handleRemoveRoom }: ISelectedProps) => (
    <FullCardStyled>
        <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: 0 }}>
            {rooms.map((room) => (
                <Grid key={uuidv4()} sx={{ pl: '1rem' }}>
                    <ResourceState key={uuidv4()} resource={room} handleRemoveRoom={handleRemoveRoom} />
                </Grid>
            ))}
        </Grid>
        {!rooms.length && <Typography sx={{ fontWeight: 'bold', fontSize: '25px', margin: '0 auto' }}>{i18next.t('emptyHere')}</Typography>}
    </FullCardStyled>
);

export default SelectedResources;
