/* eslint-disable react/no-array-index-key */
import { Box, Dialog, DialogContent, DialogTitle, Paper, Tab, Tabs } from '@mui/material';
import i18next from 'i18next';
import React, { useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AreYouSureDialog } from '../../common/AreYouSureDialog';
import { useUserStore } from '../../stores/user';
import { hasPermission } from '../../utils/ProtectedRoutes';
import { TabPanel } from '../../utils/TabPanel';
import { AddResourceButton } from './ActionButtons/AddResourceButton';
import { ResetFilterButton } from './ActionButtons/ResetFilterButton';
import { UploadExcelButton } from './ActionButtons/UploadExcelButton';
import OccupationTable from './occupationTable';
import { ResourceDialog } from './ResourceDialog';
import { Resource, resourceTabs } from './ResourceTabs';
import { ITableRef, Table } from './Table';
import { UploadExcelDialog } from './UploadExcelDialog';
import SoldierAssociationTable from './soldierAssociationTable';

interface IDialogState {
    open: boolean;
    resource: Resource | null;
}

const Resources = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [openResourceDialog, setOpenResourceDialog] = useState<IDialogState>({ open: false, resource: null });
    const [openDeleteDialog, setOpenDeleteDialog] = useState<IDialogState>({ open: false, resource: null });
    const [openOccupationDialog, setOpenOccupancyDialog] = useState<IDialogState>({ open: false, resource: null });
    const [openSoldierAssociationDialog, setOpenSoldierAssociationDialog] = useState<IDialogState>({ open: false, resource: null });

    const [openUploadExcelDialog, setOpenUploadExcelDialog] = useState(false);

    const currentResourceTab = useMemo(() => resourceTabs[tabIndex], [tabIndex]);

    const tableRef = useRef<ITableRef>(null);

    const currentUser = useUserStore((state) => state.user);

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                    <Tabs value={tabIndex} onChange={(_event, newValue: number) => setTabIndex(newValue)}>
                        {resourceTabs.map(({ label, userPermissions }, index) =>
                            hasPermission(userPermissions, currentUser) ? <Tab key={index} label={i18next.t(`resources.tabs.${label}`)} /> : null,
                        )}
                    </Tabs>
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                        <ResetFilterButton tableRef={tableRef} />
                        {currentResourceTab.excel && <UploadExcelButton onClick={() => setOpenUploadExcelDialog(true)} />}
                        <AddResourceButton onClick={() => setOpenResourceDialog({ open: true, resource: null })} />
                    </Box>
                </Box>

                {resourceTabs.map(({ fetchResources, template }, index) => (
                    <TabPanel key={index} value={tabIndex} index={index}>
                        <Table
                            ref={tableRef}
                            fetchResources={fetchResources}
                            template={template}
                            deleteRowButtonProps={
                                currentResourceTab.deleteResource
                                    ? { onClick: (resource) => setOpenDeleteDialog({ open: true, resource }) }
                                    : undefined
                            }
                            editRowButtonProps={
                                currentResourceTab.updateResource
                                    ? { onClick: (resource) => setOpenResourceDialog({ open: true, resource }) }
                                    : undefined
                            }
                            occupationButtonProps={
                                currentResourceTab.getOccupation
                                    ? { onClick: (resource) => setOpenOccupancyDialog({ open: true, resource }) }
                                    : undefined
                            }
                            soldierAssociationButtonProps={
                                currentResourceTab.getSoldierAssociation
                                    ? { onClick: (resource) => setOpenSoldierAssociationDialog({ open: true, resource }) }
                                    : undefined
                            }
                        />
                    </TabPanel>
                ))}
            </Box>

            <ResourceDialog
                open={openResourceDialog.open}
                resource={openResourceDialog.resource}
                title={i18next.t(`table.${openResourceDialog.resource ? 'edit' : 'create'}`)}
                actionButtonTitle={i18next.t(`table.${openResourceDialog.resource ? 'save' : 'create'}`)}
                handleClose={() => {
                    currentResourceTab.template.forEach((field) => field.onClose());
                    setOpenResourceDialog({ ...openResourceDialog, open: false });
                }}
                handleAction={(data) => {
                    const { createResource, updateResource } = currentResourceTab;

                    return openResourceDialog.resource && updateResource
                        ? updateResource(openResourceDialog.resource._id, data)
                        : createResource(data);
                }}
                successMessage={i18next.t(`resources.${openResourceDialog.resource ? 'updated' : 'created'}`)}
                errorMessage={i18next.t(`resources.${openResourceDialog.resource ? 'failedToUpdateResource' : 'failedToCreateResource'}`)}
                tableRef={tableRef}
                template={currentResourceTab.template}
                fieldsToRemove={currentResourceTab.fieldsToRemove}
            />

            {currentResourceTab.excel && (
                <UploadExcelDialog
                    open={openUploadExcelDialog}
                    handleClose={() => setOpenUploadExcelDialog(false)}
                    excel={currentResourceTab.excel}
                />
            )}

            {currentResourceTab.deleteResource && (
                <AreYouSureDialog
                    open={openDeleteDialog.open}
                    handleClose={() => setOpenDeleteDialog({ open: false, resource: null })}
                    onYes={async () => {
                        try {
                            if (!openDeleteDialog.resource) return;
                            await currentResourceTab.deleteResource!(openDeleteDialog.resource._id);
                            toast.success(i18next.t('resources.deleted'));
                            setOpenDeleteDialog({ open: false, resource: null });
                            tableRef.current?.refreshServerSide();
                        } catch (error) {
                            toast.error(i18next.t('resources.failedToDeleteResource'));
                        }
                    }}
                />
            )}

            {currentResourceTab.getSoldierAssociation && openSoldierAssociationDialog.resource?._id && (
                <Dialog
                    maxWidth="xl"
                    fullWidth
                    scroll="paper"
                    open={openSoldierAssociationDialog.open}
                    onClose={() => setOpenSoldierAssociationDialog({ open: false, resource: null })}
                >
                    <Paper>
                        <DialogTitle>{`${i18next.t('resources.SoldierAssociation')} ${i18next.t(
                            `resources.tabs.${currentResourceTab.label}`,
                        )}`}</DialogTitle>
                        <DialogContent>
                            <SoldierAssociationTable
                                getSoldierAssociations={currentResourceTab.getSoldierAssociation!}
                                resourceId={openSoldierAssociationDialog.resource._id}
                            />
                        </DialogContent>
                    </Paper>
                </Dialog>
            )}

            {currentResourceTab.getOccupation && openOccupationDialog.resource?._id && (
                <Dialog
                    maxWidth="xl"
                    fullWidth
                    scroll="paper"
                    open={openOccupationDialog.open}
                    onClose={() => setOpenOccupancyDialog({ open: false, resource: null })}
                >
                    <Paper>
                        <DialogTitle>{`${i18next.t('resources.occupationOf')} ${i18next.t(`resources.${currentResourceTab.label}`)}`}</DialogTitle>
                        <DialogContent>
                            <OccupationTable getOccupation={currentResourceTab.getOccupation} resourceId={openOccupationDialog.resource._id} />
                        </DialogContent>
                    </Paper>
                </Dialog>
            )}
        </>
    );
};

export default Resources;
