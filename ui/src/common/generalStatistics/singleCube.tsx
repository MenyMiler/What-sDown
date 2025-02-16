import { Assignment, People } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { environment } from '../../globals';
import { CoursesService } from '../../services/courses';
import { trycatch } from '../../utils/trycatch';
import { IconCircle } from './singleCube.styled';
import { SoldiersService } from '../../services/soldiers';

interface singleCubeProps {
    type: 'courses' | 'soldiers';
}

const { backgroundColorSignleCube, singleCube } = environment.colors;

const SingleCube = ({ type }: singleCubeProps) => {
    const [data, setData] = useState<number>(0);

    const getActives = async () => {
        setData(await (type === 'soldiers' ? SoldiersService : CoursesService).getCurrentAmount());
    };

    useEffect(() => {
        getActives();
    }, [type]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                background: backgroundColorSignleCube[type],
                gap: '1.5rem',
                padding: '1rem',
                borderRadius: '10%',
                width: '14rem',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '3rem', mt: '0.5rem', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '2rem', color: 'white' }}>{data}</Typography>
                {type === 'soldiers' ? (
                    <IconCircle sx={{ background: singleCube[type] }}>
                        <People sx={{ width: '2.5rem', height: '2.5rem' }} />
                    </IconCircle>
                ) : (
                    <IconCircle sx={{ background: singleCube[type] }}>
                        <Assignment sx={{ width: '2.5rem', height: '2.5rem' }} />
                    </IconCircle>
                )}
            </Box>

            <Typography sx={{ color: 'white' }}>{i18next.t(`singleCube.${type}`)}</Typography>
        </Box>
    );
};

export default SingleCube;
