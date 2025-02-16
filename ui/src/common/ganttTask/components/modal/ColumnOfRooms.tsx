/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
import { Grid, Typography } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { environment } from '../../../../globals';
import { Genders, RoomWithSoldiers } from '../../../../interfaces/room';
import ColumnOfGender from './ColumnOfGender';

const { colors } = environment;

interface columnOfRoomsProps {
    arrOfRooms: RoomWithSoldiers[];
}

const ColumnOfRooms = ({ arrOfRooms }: columnOfRoomsProps) => {
    const [males, SetMales] = useState<RoomWithSoldiers[]>([]);
    const [females, SetFemales] = useState<RoomWithSoldiers[]>([]);
    const [othersFemale, SetOthersFemale] = useState<RoomWithSoldiers[]>([]);
    const [othersMale, SetOthersMale] = useState<RoomWithSoldiers[]>([]);

    useEffect(() => {
        arrOfRooms.forEach((room) => {
            switch (room.gender) {
                case Genders.MALE:
                    SetMales((currMales) => [...currMales, room]);
                    break;
                case Genders.FEMALE:
                    SetFemales((currFemales) => [...currFemales, room]);
                    break;
                case Genders.OTHER_MALE:
                    SetOthersMale((currMaleOthers) => [...currMaleOthers, room]);
                    break;
                default:
                    SetOthersFemale((currFemaleOthers) => [...currFemaleOthers, room]);
                    break;
            }
        });
    }, []);

    return (
        <Grid item>
            <Grid container direction="column" spacing={2} sx={{ mt: 1, mb: 1 }}>
                <Grid item>
                    <Grid container direction="row" spacing={0.5}>
                        <Grid item>
                            <Typography sx={{ fontWeight: 'bold' }}> {i18next.t('ganttTitles.rooms')}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontWeight: 'bold' }}> ({arrOfRooms.length})</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container spacing={1} sx={{ overflowY: 'auto', overflowX: 'hidden', height: '20rem' }}>
                        {males.length ? <ColumnOfGender rooms={males} color={colors.gender.male} /> : null}
                        {females.length ? <ColumnOfGender rooms={females} color={colors.gender.female} /> : null}
                        {othersFemale.length ? <ColumnOfGender rooms={othersFemale} color={colors.gender.otherFemale} /> : null}
                        {othersMale.length ? <ColumnOfGender rooms={othersMale} color={colors.gender.otherMale} /> : null}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ColumnOfRooms;
