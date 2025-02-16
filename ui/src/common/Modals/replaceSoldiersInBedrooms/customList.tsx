/* eslint-disable react/no-array-index-key */
import { Card, CardHeader, Checkbox, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import { SoldierWithCourseId } from '../../../interfaces/soldier';

interface ICustomListProps {
    items: SoldierWithCourseId[];
    handleToggleAll: (items: SoldierWithCourseId[]) => void;
    numberOfChecked: (items: SoldierWithCourseId[]) => number;
    handleToggle: (value: SoldierWithCourseId) => void;
    checkedSoldiers: SoldierWithCourseId[];
}

const CustomList = (props: ICustomListProps) => {
    const { items, handleToggleAll, numberOfChecked, handleToggle, checkedSoldiers } = props;

    return (
        <Card sx={{ width: 211 }}>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={() => handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && !!items.length}
                        indeterminate={numberOfChecked(items) !== items.length && !!numberOfChecked(items)}
                        disabled={!items.length}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={i18next.t('wizard.replaceSoldiersInBedrooms.soldiersInBedroom')}
                subheader={`${numberOfChecked(items)}/${items.length} ${i18next.t('wizard.replaceSoldiersInBedrooms.selected')}`}
            />
            <Divider />
            <List
                sx={{
                    width: 211,
                    height: 330,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value: SoldierWithCourseId, index) => {
                    const labelId = `transfer-list-all-item-${value}-label`;
                    return (
                        <ListItem key={index} role="listitem" onClick={() => handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checkedSoldiers.includes(value)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.name} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );
};

export default CustomList;
