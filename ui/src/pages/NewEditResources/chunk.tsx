import React from 'react';
import i18next from 'i18next';
import { Box, Divider, Typography } from '@mui/material';
import Resource from './resource';
import { RoomWithCapacity } from '../../interfaces/room';

export enum StateTypes {
    EMPTY = 'empty',
    OCCUPIED = 'occupied',
    FULL = 'full',
}

export const getStateColor = (state: StateTypes): string => {
    switch (state) {
        case StateTypes.OCCUPIED:
            return '#89D2FF';
        case StateTypes.FULL:
            return '#a83238';
        case StateTypes.EMPTY:
        default:
            return '#88DCB2';
    }
};

interface ChunkProps {
    state: StateTypes;
    resources: RoomWithCapacity[];
    handleChange: (room: RoomWithCapacity, newCapacity: number) => void;
    changes: RoomWithCapacity[];
}

const Chunk = ({ state, resources, handleChange, changes }: ChunkProps) => {
    return (
        <Box display="flex" flexDirection="column" padding="8px 10px" width="20rem" bgcolor="#f9f9f9">
            <Box display="flex" alignItems="center" gap="0.5rem" mt="0.5rem" mb="1rem" ml="0.5rem">
                <Box
                    sx={{
                        width: '4px',
                        height: '16px',
                        gap: '0px',
                        borderRadius: '0px 100px 100px 0px',
                        backgroundColor: getStateColor(state),
                    }}
                />
                <Typography variant="body2">{i18next.t(`newEditResourcesPage.${state}`)}</Typography>
            </Box>

            {resources.map((resource, index) => {
                return (
                    <Box key={`key-${resource._id}`}>
                        <Resource resource={resource} handleChange={handleChange} changes={changes} />
                        {index + 1 < resources.length && <Divider />}
                    </Box>
                );
            })}
        </Box>
    );
};

export default Chunk;
