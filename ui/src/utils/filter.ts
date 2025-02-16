import { ViewMode } from '../common/ganttTask';

export interface Filter {
    startDate?: Date;
    endDate?: Date;
    viewMode?: ViewMode;
}
