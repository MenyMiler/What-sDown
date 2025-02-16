import { ViewMode } from '../common/ganttTask';

export const getColumnWidth = (view: ViewMode) => {
    switch (view) {
        case ViewMode.Day:
            return 1370;
        case ViewMode.Week:
            return 196;
        case ViewMode.TwoWeek:
            return 116;
        default:
            return 196;
    }
};
