/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { environment } from '../../../globals';
import { BedroomGantt } from '../../../interfaces/roomInCourse';
import { SoldierWithCourseId } from '../../../interfaces/soldier';
import { SoldierInCourse } from '../../../interfaces/soldierInRoomInCourse';
import { Types } from '../../../interfaces/user';
import { BasesService } from '../../../services/bases';
import { SoldiersInRoomInCourseService } from '../../../services/soldiersInRoomInCourse';
import { useUserStore } from '../../../stores/user';
import { SortDate } from '../../filterSelect/SortDate';
import { GridWrapper } from '../modals.styled';
import CustomList from './customList';
import FormControlElement from './formControlElement';
import { RoomsService } from '../../../services/rooms';

const replaceSoldiersInBedroomsSchema = yup.object({});

type Side = 'right' | 'left';

const ReplaceSoldiersInBedrooms = (isStaff: boolean) => {
    const currentUser = useUserStore(({ user }) => user);
    const [checkedSoldiers, setCheckedSoldiers] = useState<SoldierWithCourseId[]>([]);
    const [baseId, setBaseId] = useState<string>(currentUser.baseId!);
    const [bedrooms, setBedrooms] = useState<BedroomGantt[]>([]);
    const [firstBedroomId, setFirstBedroomId] = useState<string>('');
    const [secondBedroomId, setSecondBedroomId] = useState<string>('');
    const [firstBedroomSoldiers, setFirstBedroomSoldiers] = useState<SoldierWithCourseId[]>([]);
    const [secondBedroomSoldiers, setSecondBedroomSoldiers] = useState<SoldierWithCourseId[]>([]);
    const [dateFilter, setDateFilter] = useState<{ startDate: Date; endDate: Date }>({ startDate: new Date(), endDate: new Date() });
    const [open, setOpen] = useState<boolean>(false);
    const [firstBedroom, setFirstBedroom] = useState<BedroomGantt>();
    const [secondBedroom, setSecondBedroom] = useState<BedroomGantt>();
    const [selectedSide, setSelectedSide] = useState<Side>('right');

    const { data: bases } = useQuery({
        queryKey: ['bases'],
        queryFn: () => BasesService.getByQuery(),
        meta: { errorMessage: i18next.t('wizard.admins.errors.baseError') },
        initialData: [],
    });

    const getDisjointItems = (firstSoldiers: SoldierWithCourseId[], secondSoldiers: SoldierWithCourseId[], shouldFindIntersection: boolean) =>
        firstSoldiers.filter((solider) => secondSoldiers.includes(solider) === shouldFindIntersection);

    const union = (firstSoldiers: SoldierWithCourseId[], secondSoldiers: SoldierWithCourseId[]) => [
        ...firstSoldiers,
        ...getDisjointItems(secondSoldiers, firstSoldiers, false),
    ];

    const rightChecked = getDisjointItems(checkedSoldiers, firstBedroomSoldiers, true);
    const leftChecked = getDisjointItems(checkedSoldiers, secondBedroomSoldiers, true);

    const handleToggle = (solider: SoldierWithCourseId) => {
        const newCheckedSoldiers = [...checkedSoldiers];

        if (!checkedSoldiers.includes(solider)) newCheckedSoldiers.push(solider);
        else newCheckedSoldiers.splice(checkedSoldiers.indexOf(solider), 1);
        setCheckedSoldiers(newCheckedSoldiers);
    };

    const numberOfChecked = (soldiers: SoldierWithCourseId[]) => getDisjointItems(checkedSoldiers, soldiers, true).length;

    const handleToggleAll = (soldiers: SoldierWithCourseId[]) =>
        setCheckedSoldiers(
            numberOfChecked(soldiers) === soldiers.length ? getDisjointItems(checkedSoldiers, soldiers, false) : union(checkedSoldiers, soldiers),
        );

    const areArraysEqual = (array1: any, array2: any) => _.isEqual(array1, array2);

    const addSoldierToBedroom = async (requestedSoldiers: SoldierWithCourseId[]): Promise<any[]> => {
        const isRightClicked = areArraysEqual(requestedSoldiers, rightChecked);
        const soldiersByCourse: Map<string, string[]> = new Map();

        requestedSoldiers.forEach((soldier: SoldierWithCourseId) => {
            const soldiersArray = soldiersByCourse.get(soldier.courseId);
            soldiersArray?.push(soldier._id);
            soldiersByCourse.set(soldier.courseId, soldiersArray || [soldier._id]);
        });
        const soldiersByCourseArray: SoldierInCourse[] = Array.from(soldiersByCourse.entries()).map(([course, soldiers]) => ({
            courseId: course,
            soldiersIds: soldiers,
        }));

        return SoldiersInRoomInCourseService.replaceSoldiers(
            soldiersByCourseArray,
            isRightClicked ? firstBedroomId : secondBedroomId,
            isRightClicked ? secondBedroomId : firstBedroomId,
            dateFilter.startDate,
            dateFilter.endDate,
            isStaff,
        );
    };

    const getSoldiersInSelectedBedroom = (bedroomId: string) => SoldiersInRoomInCourseService.getSoldiersInBedroom(bedroomId);
    const refetchSoldiersInBedroom = async (bedroomId: string, setBedroomFunc: Function) =>
        setBedroomFunc(await getSoldiersInSelectedBedroom(bedroomId));

    const refetchSoldiersInFirstBedroom = refetchSoldiersInBedroom.bind(null, firstBedroomId, setFirstBedroomSoldiers);
    const refetchSoldiersInSecondBedroom = refetchSoldiersInBedroom.bind(null, secondBedroomId, setSecondBedroomSoldiers);

    const handleConfirm = async (isRightSelected: boolean) => {
        try {
            const checkedList = isRightSelected ? rightChecked : leftChecked;
            const results = await addSoldierToBedroom(checkedList);
            if (results)
                toast.success(
                    currentUser.currentUserType === Types.SUPERADMIN
                        ? i18next.t('wizard.superAdminSuccess')
                        : i18next.t('wizard.replaceSoldiersInBedrooms.success'),
                );
            await Promise.all([refetchSoldiersInFirstBedroom(), refetchSoldiersInSecondBedroom()]);
            setCheckedSoldiers(getDisjointItems(checkedSoldiers, checkedList, false));
        } catch (error) {
            if (axios.isAxiosError(error) && error.response)
                toast.error(i18next.t(`wizard.replaceSoldiersInBedrooms.errors.${error.response.data.message}`));
        }
        setOpen(false);
    };

    const handleChecked = async (isRightOrLeft: boolean) => {
        setSelectedSide(isRightOrLeft ? 'right' : 'left');
        if (isRightOrLeft ? secondBedroomId : firstBedroomId) {
            const differentGender = (await RoomsService.getById(firstBedroomId)).gender !== (await RoomsService.getById(secondBedroomId)).gender;
            if (differentGender) setOpen(true);
            else handleConfirm(isRightOrLeft);
        } else toast.info(i18next.t('wizard.replaceSoldiersInBedrooms.errorSelectBedroom'));
    };

    useEffect(() => {
        const getBedrooms = async () => {
            setFirstBedroomId('');
            setSecondBedroomId('');
            setFirstBedroomSoldiers([]);
            setSecondBedroomSoldiers([]);
            const bedroomsArray = await BasesService.bedroomGantt(baseId, {
                startDate: dateFilter.startDate,
                endDate: dateFilter.endDate,
                isStaff,
            });
            setBedrooms(bedroomsArray);
        };
        getBedrooms();
    }, [baseId, dateFilter]);

    const checkIsMaxCapacity = (isFirst: boolean) => {
        const bedroom = isFirst ? firstBedroom : secondBedroom;
        const soldierCount = isFirst ? firstBedroomSoldiers.length : secondBedroomSoldiers.length;
        const isCapacity = bedroom && bedroom.maxCapacity <= soldierCount;
        if (isCapacity) toast.info(i18next.t('wizard.replaceSoldiersInBedrooms.maxCapacityError'));
    };

    useEffect(() => {
        checkIsMaxCapacity(true);
    }, [firstBedroomId]);

    useEffect(() => {
        checkIsMaxCapacity(false);
    }, [secondBedroomId]);

    const setSoldiersBedroom = (
        setBedroomIdFunc: Function,
        setBedroomFunc: Function,
        setBedroomSoldiersFunc: Function,
        roomId: string,
        selectedBedroom: BedroomGantt | undefined,
        soldiersInBedroom: any[],
    ) => {
        setBedroomIdFunc(roomId);
        setBedroomFunc(selectedBedroom);
        setBedroomSoldiersFunc(soldiersInBedroom);
    };
    const setFirstSoldiersBedroom = setSoldiersBedroom.bind(null, setFirstBedroomId, setFirstBedroom, setFirstBedroomSoldiers);
    const setSecondSoldiersBedroom = setSoldiersBedroom.bind(null, setSecondBedroomId, setSecondBedroom, setSecondBedroomSoldiers);
    const setSoldiersBedroomIsFirst = (isFirst: boolean) => (isFirst ? setFirstSoldiersBedroom : setSecondSoldiersBedroom);

    const handleSelectedBedroom = async (_event: React.SyntheticEvent<Element, Event>, userInputValue: any, isFirst: boolean) => {
        if (userInputValue) {
            const roomId = userInputValue.id;
            const selectedBedroom = bedrooms.find((bedroom) => bedroom._id === roomId);
            const soldiersInBedroom = await getSoldiersInSelectedBedroom(roomId);
            setSoldiersBedroomIsFirst(isFirst)(roomId, selectedBedroom, soldiersInBedroom);
        } else if (isFirst) setFirstBedroomSoldiers([]);
        else setSecondBedroomSoldiers([]);
    };

    const handleClose = (isFirst: boolean) => setSoldiersBedroomIsFirst(isFirst)('', undefined, []);

    const setClose = () => setOpen(false);

    const filteredFirstBedrooms = bedrooms.filter((option) => option !== secondBedroom);
    const filteredSecondBedrooms = bedrooms.filter((option) => option !== firstBedroom);

    return (
        <GridWrapper container sx={{ height: '39rem' }}>
            <Dialog open={open} onClose={setClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {i18next.t('wizard.replaceSoldiersInBedrooms.attentionMessage')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>{i18next.t('courseDetailsModal.cancel')}</Button>
                    <Button onClick={() => handleConfirm(!!(selectedSide === 'right'))}>{i18next.t('courseDetailsModal.accept')}</Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {Boolean(bases.length) && (
                    <FormControl sx={{ width: 240, backgroundColor: 'white', marginLeft: '3%' }}>
                        <InputLabel id="label">{i18next.t('wizard.replaceSoldiersInBedrooms.base')}</InputLabel>
                        <Select
                            labelId="label"
                            label={i18next.t('wizard.replaceSoldiersInBedrooms.base')}
                            onChange={(event) => setBaseId(event.target.value)}
                            value={baseId}
                        >
                            {bases.map((base, index) => (
                                <MenuItem key={index} value={base._id} sx={{ minWidth: 140 }}>
                                    {base.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <Grid item sx={{ marginLeft: '17%' }}>
                    <SortDate size="94%" setFilter={setDateFilter} hasEndDate defaultRangeInDays={environment.defaultRangeInDays} />
                </Grid>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlElement
                    baseId={baseId}
                    dateFilter={dateFilter}
                    handleClose={handleClose}
                    onChange={handleSelectedBedroom}
                    bedrooms={filteredFirstBedrooms}
                    isRight
                />
                <FormControlElement
                    baseId={baseId}
                    dateFilter={dateFilter}
                    handleClose={handleClose}
                    onChange={handleSelectedBedroom}
                    bedrooms={filteredSecondBedrooms}
                    isRight={false}
                />
            </Box>

            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>
                    <CustomList
                        items={firstBedroomSoldiers}
                        handleToggleAll={handleToggleAll}
                        numberOfChecked={numberOfChecked}
                        handleToggle={handleToggle}
                        checkedSoldiers={checkedSoldiers}
                    />
                </Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={() => handleChecked(true)}
                            disabled={!rightChecked.length}
                            aria-label="move selected right"
                        >
                            <KeyboardDoubleArrowLeftIcon />
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            size="small"
                            variant="outlined"
                            onClick={() => handleChecked(false)}
                            disabled={!leftChecked.length}
                            aria-label="move selected left"
                        >
                            <KeyboardDoubleArrowRightIcon />
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>
                    <CustomList
                        items={secondBedroomSoldiers}
                        handleToggleAll={handleToggleAll}
                        numberOfChecked={numberOfChecked}
                        handleToggle={handleToggle}
                        checkedSoldiers={checkedSoldiers}
                    />
                </Grid>
            </Grid>
        </GridWrapper>
    );
};

export { ReplaceSoldiersInBedrooms, replaceSoldiersInBedroomsSchema };
