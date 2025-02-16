/* eslint-disable indent */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import i18next from 'i18next';
import RequestsTable from '../../common/RequestManagement/RequestsTable';
import { RequestStatuses, RequestsTypesByCategory, RequestsTypesCategories, RequestTypes } from '../../interfaces/request';
import { environment } from '../../globals';
import { hasPermission } from '../../utils/ProtectedRoutes';
import { RequestsService } from '../../services/requests';
import { useUserStore } from '../../stores/user';

const { permissions } = environment;

interface IRequestsTabProps {
    requestStatuses: RequestStatuses[];
    onEdit: () => void;
}

const RequestsTab = ({ requestStatuses, onEdit }: IRequestsTabProps) => {
    const [requestsAmountByCategory, setRequestsAmountByCategory] = useState<Map<RequestTypes, number>>(new Map());
    const [toggleTabs, setToggleTabs] = useState<[boolean, boolean, boolean]>([false, false, false]);
    const [reRenderFlag, setReRenderFlag] = useState(false);
    const currentUser = useUserStore(({ user }) => user);

    const reRender = () => {
        onEdit();
        setReRenderFlag((current) => !current);
    };

    useEffect(() => {
        const init = async () => {
            const [firstTypeAmountsArr, secondTypeAmountsArr] = await Promise.all(
                requestStatuses.map((status) => RequestsService.getAllTypeCountsByStatus(status, currentUser.id!, currentUser.baseId!)),
            );

            if (!secondTypeAmountsArr) {
                setRequestsAmountByCategory(new Map(firstTypeAmountsArr.flat().map((amountObject) => [amountObject.type, amountObject.amount])));
            } else {
                const resultMap = new Map();

                firstTypeAmountsArr.forEach((amountObject) => {
                    resultMap.set(amountObject.type, amountObject.amount);
                });

                secondTypeAmountsArr.forEach((amountObject) =>
                    resultMap.get(amountObject.type)
                        ? resultMap.set(amountObject.type, amountObject.amount + resultMap.get(amountObject.type))
                        : resultMap.set(amountObject.type, amountObject.amount),
                );

                setRequestsAmountByCategory(resultMap);
            }
        };

        init();
    }, [reRenderFlag, currentUser.baseId!]);

    return (
        <>
            {Object.keys(RequestsTypesByCategory).map((category, index) => (
                <Accordion key={category} expanded={toggleTabs[index]} sx={{ minHeight: '4rem' }}>
                    <AccordionSummary
                        onClick={() => {
                            const newArr: [boolean, boolean, boolean] = [...toggleTabs];
                            newArr[index] = !toggleTabs[index];
                            setToggleTabs(newArr);
                        }}
                        expandIcon={<ExpandMore />}
                    >
                        <Typography fontWeight="bold">{i18next.t(`requests.${category}`)}</Typography>
                        {hasPermission(permissions.resourceManager, currentUser) && requestStatuses.includes(RequestStatuses.DONE) ? null : (
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    ml: '0.5rem',
                                    bgcolor: '#e9e9e9',
                                    paddingX: '8px',
                                    paddingY: '2px',
                                    borderRadius: '50%',
                                }}
                            >
                                {RequestsTypesByCategory[category as RequestsTypesCategories].reduce(
                                    (accumulator, value) => accumulator + (requestsAmountByCategory.get(value) || 0),
                                    0,
                                )}
                            </Typography>
                        )}
                    </AccordionSummary>
                    <AccordionDetails>
                        {toggleTabs[index] && (
                            <RequestsTable
                                requestStatuses={requestStatuses}
                                requestCategory={category as RequestsTypesCategories}
                                onEdit={reRender}
                            />
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};

export default RequestsTab;
