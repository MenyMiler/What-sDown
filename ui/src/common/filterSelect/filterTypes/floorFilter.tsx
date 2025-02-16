/* eslint-disable indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid } from '@mui/material';
import * as React from 'react';
import i18next from 'i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { Done as DoneIcon } from '@mui/icons-material';
import LayersIcon from '@mui/icons-material/Layers';
import { FloorDocument } from '../../../interfaces/floor';
import { styleData, styleNoData } from './style';
import FilterTitle from '../filterTitle';
import { FloorsService } from '../../../services/floors';

interface IFloorFilter {
    setFilter: (newValue: any) => void;
    buildingId: string | undefined;
    currentFloorId: string | undefined;
}

const FloorFilter = ({ setFilter, buildingId, currentFloorId }: IFloorFilter) => {
    const [floors, setFloors] = useState<FloorDocument[]>([]);
    const [expanded, setExpanded] = useState<boolean>(false);

    const handleChange = (newValue: string | null) => {
        const filterValue = newValue === currentFloorId ? undefined : newValue;
        setFilter((curr: {}) => ({ ...curr, ...{ floorId: filterValue || undefined } }));
    };

    useEffect(() => {
        const getBuildingFloors = async () => {
            const result = await FloorsService.getByQuery({ buildingId });
            setFloors(result);
        };

        if (buildingId) getBuildingFloors();
        else {
            setFloors([]);
            setExpanded(false);
            handleChange(null);
        }
    }, [buildingId]);

    return (
        <Grid container>
            <Accordion disabled={!buildingId} expanded={expanded} sx={{ width: '100%', boxShadow: 0 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ padding: 0 }}
                    onClick={() => setExpanded((curr) => (buildingId ? !curr : curr))}
                >
                    <FilterTitle disabled={!currentFloorId} resetFilter={() => handleChange(null)} title="filterGantt.floor" />
                </AccordionSummary>
                <AccordionDetails sx={floors.length ? styleData : styleNoData}>
                    <Grid container spacing={1}>
                        {floors.length ? (
                            floors.map(({ floorNumber, _id }) => (
                                <Grid item key={_id}>
                                    <Chip
                                        onClick={() => handleChange(_id)}
                                        icon={currentFloorId === _id ? <DoneIcon /> : <LayersIcon />}
                                        color={currentFloorId === _id ? 'primary' : undefined}
                                        label={floorNumber}
                                        size="small"
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Grid sx={{ ml: '1rem' }}> {i18next.t('noData')}</Grid>
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Grid>
    );
};

export default FloorFilter;
