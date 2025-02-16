/* eslint-disable indent */
/* eslint-disable no-param-reassign */
import { Grid } from '@mui/material';
import i18next from 'i18next';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import Sorts, { PageType } from '../../common/filterSelect';
import { Task, ViewMode } from '../../common/ganttTask';
import { Gantt } from '../../common/ganttTask/components/gantt/gantt';
import { getColumnWidth } from '../../utils/gantt';
import { CoursesService } from '../../services/courses';
import { useUserStore } from '../../stores/user';

const RecruitGantt = () => {
    const [resources, setResources] = React.useState<Task[][]>([[]]);
    const [resourcesItems, setResourcesItems] = React.useState<Task[]>([]);
    const [isChecked, _setIsChecked] = React.useState(true);
    const [filter, setFilter] = React.useState<any>({ recruit: true });
    const currentUser = useUserStore(({ user }) => user);
    const view = ViewMode.Day;

    const returnResource = (resource: any, index: number, isItems: boolean = false) => {
        let start: Date = new Date();
        let end: Date = new Date();
        if (resource) {
            start = new Date(`${resource.startDate}`);
            end = new Date(`${resource.endDate}`);
        }

        return {
            start,
            end,
            title: isItems
                ? `${i18next.t('ganttTitles.recruits')} ${i18next.t(`months.${resource.title}`)} - ${start!.getFullYear()}`
                : `${i18next.t('ganttTitles.recruits')} ${i18next.t(`months.${resource.title}`)}`,
            id: isItems ? `recruit2-${index}` : `recruit1-${index}`,
            subTitle: `${i18next.t('wizard.addBedroomToCourseRequest.amount')} - ${i18next.t(resource.amount)}`,
            type: 'project',
        };
    };

    useEffect(() => {
        async function getResources() {
            try {
                const result = await CoursesService.recruitGantt(currentUser.baseId!);

                setResourcesItems([]);
                setResources([]);

                if (!result.length) return;

                setResources(result.map((resource: any, index: number) => returnResource(resource, index)) as any[]);
                setResourcesItems(result.map((resource: any, index: number) => returnResource(resource, index, true)) as any[]);
            } catch (_err) {
                toast.error(i18next.t('wizard.error'));
            }
        }
        getResources();
    }, [filter, currentUser.baseId!]);

    return (
        <Grid container direction="column" spacing={2.5} sx={{ width: '95%', ml: '2.5%' }}>
            <Grid item>
                <Sorts setFilter={setFilter} filter={filter} pageType={PageType.RECRUIT} />
            </Grid>
            <Grid item sx={{ width: '100%' }}>
                <Gantt
                    tasks={resources}
                    viewMode={view}
                    columnWidth={getColumnWidth(view)}
                    editMode={false}
                    resourcesItems={resourcesItems}
                    title={i18next.t('ganttTitles.recruits')}
                    listCellWidth={isChecked ? '80' : ''}
                    filter={filter}
                />
            </Grid>
        </Grid>
    );
};

export default RecruitGantt;
