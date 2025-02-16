/* eslint-disable indent */
/* eslint-disable react/require-default-props */
import { AutocompleteInputChangeReason } from '@mui/material';
import i18next from 'i18next';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AutocompleteElement } from 'react-hook-form-mui';
import { environment } from '../../globals';
import { Event, EventDocument } from '../../interfaces/event';
import { EventsService } from '../../services/events';

const { magicWidth } = environment;

interface IEventSearchProps {
    setDisabledTextFields: (currentEvent: Event) => void;
    maxWidth?: boolean;
    displaySavedData: boolean;
}

const EventSearch = (props: IEventSearchProps) => {
    const { setDisabledTextFields, maxWidth, displaySavedData } = props;
    const [events, setEvents] = useState<EventDocument[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);

    const { watch, setValue } = useFormContext();
    const watchEventId: string | undefined = watch('eventId');

    const searchEventDebounced = _.debounce(async (_e: React.SyntheticEvent, eventName: string, reason: AutocompleteInputChangeReason) => {
        if (reason === 'input') setValue('eventId', '');
        setEventsLoading(true);
        setEvents(
            eventName
                ? await EventsService.getByQuery({
                      name: eventName,
                      limit: 10,
                      populate: false,
                  })
                : [],
        );
        setEventsLoading(false);
    }, 500);

    const setDisabledTextFieldsWrapper = async () => {
        if (!watchEventId) return;
        const currentEvent = await EventsService.getById(watchEventId, false);
        setDisabledTextFields(currentEvent);
    };

    useEffect(() => {
        setDisabledTextFieldsWrapper();
    }, [watchEventId]);

    useEffect(() => {
        const getSavedEvent = async () =>
            setEvents((await EventsService.getByQuery({ startDate: new Date(Date.now()), limit: 10 })) as EventDocument[]);
        if (displaySavedData) getSavedEvent();
    }, [displaySavedData]);

    return (
        <AutocompleteElement
            name="eventId"
            label={i18next.t('common.eventName')}
            options={events.map((event) => ({ label: event.name, id: event._id }))}
            loading={eventsLoading}
            autocompleteProps={{
                isOptionEqualToValue: (option, value) => option === value,
                disableClearable: true,
                freeSolo: true,
                onInputChange: searchEventDebounced,
                sx: { width: maxWidth ? '100%' : magicWidth },
            }}
            required
            matchId
        />
    );
};

export default EventSearch;
