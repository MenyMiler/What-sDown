/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
import React, { useState } from 'react';
import { Backdrop, Fade, Modal } from '@mui/material';
import PageOneModal from './modal/pageOne';
import PageTwoModal from './modal/pageTwo';
import { PopulatedEvent } from '../../interfaces/event';

interface courseDetailsProps {
    event: PopulatedEvent;
    open: boolean;
    handleClose: () => any;
}

const EventDetails = ({ event, open, handleClose }: courseDetailsProps) => {
    const [pageIndex, setPageIndex] = useState<number>(1);

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div>
                        {pageIndex === 1 ? (
                            <PageOneModal event={event} setPageIndex={setPageIndex} />
                        ) : (
                            pageIndex === 2 && <PageTwoModal event={event} setPageIndex={setPageIndex} />
                        )}
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default EventDetails;
