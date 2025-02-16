/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { Box } from '@mui/material';
import Chunk, { StateTypes } from './chunk';
import { ResourcesTypes } from './extendedCube';
import { RoomWithCapacity } from '../../interfaces/room';

interface CubeProps {
    resources: RoomWithCapacity[];
    openFilterCubeState: boolean;
    resourceType: ResourcesTypes;
    handleChange: (room: RoomWithCapacity, newCapacity: number) => void;
    changes: RoomWithCapacity[];
}

const Cube = ({ resources, openFilterCubeState, resourceType, handleChange, changes }: CubeProps) => {
    const [occupiedResources, emptyResources] = resources.reduce(
        ([occupied, empty], resource) => {
            resource.currentCapacity ? occupied.push(resource) : empty.push(resource);
            return [occupied, empty];
        },
        [[] as RoomWithCapacity[], [] as RoomWithCapacity[]],
    );

    const getCorrectWidth = (): string => {
        if (openFilterCubeState)
            switch (resourceType) {
                case ResourcesTypes.CLASS:
                case ResourcesTypes.OFFICE:
                    return '20.9rem';
                case ResourcesTypes.SOLDIER_BEDROOM:
                case ResourcesTypes.STAFF_BEDROOM:
                default:
                    return '25rem';
            }

        return '32.5rem';
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            padding="8px 10px"
            width="22rem"
            height={getCorrectWidth()}
            bgcolor="#f9f9f9"
            border="1px solid #e0e0e0"
            borderRadius="1rem"
            overflow="auto"
            sx={{
                '&::-webkit-scrollbar': {
                    display: 'none', // Hide the scrollbar
                },
                '&': {
                    msOverflowStyle: 'none', // For IE and Edge to hide the scrollbar
                    scrollbarWidth: 'none', // For Firefox to hide the scrollbar
                },
            }}
        >
            {Boolean(emptyResources.length) && (
                <Chunk resources={emptyResources} state={StateTypes.EMPTY} handleChange={handleChange} changes={changes} />
            )}
            {Boolean(occupiedResources.length) && (
                <Chunk resources={occupiedResources} state={StateTypes.OCCUPIED} handleChange={handleChange} changes={changes} />
            )}
        </Box>
    );
};

export default Cube;
