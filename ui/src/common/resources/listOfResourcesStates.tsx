/* eslint-disable default-param-last */
/* eslint-disable react/require-default-props */
import { Grid, Skeleton, Typography } from '@mui/material';
import i18next from 'i18next';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { v4 as uuidv4 } from 'uuid';
import '../../css/infiniteScroll.css';
import { RoomWithCapacity } from '../../interfaces/room';
import ResourceState from './resourceState';
import { StyledLoader } from './styled';

interface listOfResourcesStatesProps {
    resources: RoomWithCapacity[];
    handleSelectRoom?: (room: RoomWithCapacity) => Promise<void>;
    nextStep: () => void;
    hasMore: boolean;
}

const ListOfResourcesStates = ({ handleSelectRoom, resources, nextStep, hasMore }: listOfResourcesStatesProps) => (
    <InfiniteScroll
        endMessage={
            <div>
                {!resources.length && (
                    <Typography sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '1rem', width: '100%' }}>{i18next.t('noData')}</Typography>
                )}
            </div>
        }
        height="90%"
        dataLength={resources.length}
        next={nextStep}
        hasMore={hasMore}
        loader={
            <StyledLoader key={0}>
                <Grid sx={{ width: '100%' }}>
                    {Array.from(Array(6).keys()).map(() => (
                        <Typography key={uuidv4()} variant="h2">
                            <Skeleton />
                        </Typography>
                    ))}
                </Grid>
            </StyledLoader>
        }
        style={{ overflowX: 'hidden', overflowY: 'scroll' }}
    >
        {resources.map((resource, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ResourceState key={index} resource={resource} handleSelectRoom={handleSelectRoom} />
        ))}
    </InfiniteScroll>
);

export default ListOfResourcesStates;
