import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CapacityButton from './capacityButton';
import { RoomWithCapacity } from '../../interfaces/room';

interface ResourceProps {
    resource: RoomWithCapacity;
    handleChange: (room: RoomWithCapacity, newCapacity: number) => void;
    changes: RoomWithCapacity[];
}

const Resource = ({ resource, handleChange, changes }: ResourceProps) => {
    const temp = changes.find((change) => change._id === resource._id);
    const [value, setValue] = useState<number>(temp ? temp.currentCapacity : 0);

    useEffect(() => {
        handleChange(resource, value);
    }, [value]);

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" padding="8px 10px" width="19rem" bgcolor="#f9f9f9">
            <Box textAlign="left" minWidth="0" flex="1">
                <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        fontSize: '1rem',
                    }}
                    title={resource.name}
                >
                    {resource.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {resource.currentCapacity}/{resource.maxCapacity}
                </Typography>
            </Box>

            <CapacityButton value={value} setValue={setValue} max={resource.maxCapacity - resource.currentCapacity} min={0} />
        </Box>
    );
};

export default Resource;
