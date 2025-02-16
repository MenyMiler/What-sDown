/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Card, Fade, IconButton, Slider } from '@mui/material';
import Box from '@mui/material/Box';
import i18next from 'i18next';
import React, { useMemo, useState } from 'react';
import { environment } from '../../globals';
import { RoomWithCapacity } from '../../interfaces/room';
import { StyledTypography } from './styled';

const { colors } = environment;
interface resourceStateProps {
    resource: RoomWithCapacity;
    handleSelectRoom?: (room: RoomWithCapacity) => Promise<void>;
    handleRemoveRoom?: (room: RoomWithCapacity) => Promise<void>;
}

const ResourceState = ({ handleSelectRoom, resource, handleRemoveRoom }: resourceStateProps) => {
    const { name, type, currentCapacity, maxCapacity } = resource;
    const [checked, setChecked] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);

    const colorStatus = useMemo(() => {
        if (currentCapacity >= maxCapacity) return colors.resourceState.full;
        if (!currentCapacity) return colors.resourceState.empty;
        return colors.resourceState.occupied;
    }, [resource]);

    return (
        <Card
            sx={{
                background: '#F8F8F8',
                display: 'flex',
                minWidth: '15vw',
                height: '3rem',
                mb: '0.5rem',
                width: '95%',
                ':hover': { opacity: '0.8' },
            }}
        >
            <Box sx={{ bgcolor: colorStatus, width: '0.55rem', height: '3rem' }} />

            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                    {/* Plus icon */}
                    <Box>
                        {handleSelectRoom ? (
                            <IconButton
                                onClick={() => {
                                    setChecked((curr) => !curr);
                                    if (checked && sliderValue)
                                        handleSelectRoom({
                                            ...resource,
                                            currentCapacity: sliderValue,
                                            isInCurrCourse: true,
                                            lastCapacity: resource.currentCapacity,
                                        });
                                }}
                                sx={{ color: colors.button.errorSecondary }}
                            >
                                {!checked ? <AddCircleOutlineOutlinedIcon /> : <CheckCircleOutlineIcon />}
                            </IconButton>
                        ) : handleRemoveRoom ? (
                            <IconButton onClick={() => handleRemoveRoom(resource)} sx={{ color: colors.button.errorSecondary }}>
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                        ) : null}
                    </Box>
                    {/* Room name */}
                    <Box>
                        <StyledTypography style={{ marginRight: '1rem' }}>
                            {i18next.t(`resourceManagement.resourceState.${type}`)} {name}
                        </StyledTypography>
                    </Box>
                </Box>
                {/* Scroll select capacity */}
                <>
                    <Box sx={{ width: '30%' }}>
                        <Fade in={checked}>
                            <Box>
                                <Slider
                                    size="small"
                                    sx={{ top: '1rem', color: colors.resourceState.empty }}
                                    defaultValue={0}
                                    valueLabelDisplay="on"
                                    step={1}
                                    min={0}
                                    max={maxCapacity - currentCapacity}
                                    value={sliderValue}
                                    onChange={(_e, value) => setSliderValue(value as number)}
                                />
                            </Box>
                        </Fade>
                    </Box>
                    {/* Capacity */}
                    <Box sx={{ marginRight: '12px' }}>
                        <StyledTypography>
                            {currentCapacity > maxCapacity ? maxCapacity : currentCapacity ? currentCapacity : 0}/{maxCapacity}
                        </StyledTypography>
                    </Box>
                </>
            </Box>
        </Card>
    );
};

export default ResourceState;
