import { Task, ViewMode } from '../types/public-types';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import DateTimeFormat = Intl.DateTimeFormat;

type DateHelperScales = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

const intlDTCache: any = {};
export const getCachedDateTimeFormat = (locString: string | string[], opts: DateTimeFormatOptions = {}): DateTimeFormat => {
    const key = JSON.stringify([locString, opts]);
    let dtf = intlDTCache[key];
    if (!dtf) {
        dtf = new Intl.DateTimeFormat(locString, opts);
        intlDTCache[key] = dtf;
    }
    return dtf;
};

export const addToDate = (date: Date, quantity: number, scale: DateHelperScales) => {
    const newDate = new Date(
        date.getFullYear() + (scale === 'year' ? quantity : 0),
        date.getMonth() + (scale === 'month' ? quantity : 0),
        date.getDate() + (scale === 'day' ? quantity : 0),
        date.getHours() + (scale === 'hour' ? quantity : 0),
        date.getMinutes() + (scale === 'minute' ? quantity : 0),
        date.getSeconds() + (scale === 'second' ? quantity : 0),
        date.getMilliseconds() + (scale === 'millisecond' ? quantity : 0),
    );
    return newDate;
};

export const startOfDate = (date: Date, scale: DateHelperScales) => {
    const scores = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'];

    const shouldReset = (_scale: DateHelperScales) => {
        const maxScore = scores.indexOf(scale);
        return scores.indexOf(_scale) <= maxScore;
    };
    const newDate = new Date(
        date.getFullYear(),
        shouldReset('year') ? 0 : date.getMonth(),
        shouldReset('month') ? 1 : date.getDate(),
        shouldReset('day') ? 0 : date.getHours(),
        shouldReset('hour') ? 0 : date.getMinutes(),
        shouldReset('minute') ? 0 : date.getSeconds(),
        shouldReset('second') ? 0 : date.getMilliseconds(),
    );
    return newDate;
};

export const ganttDateRange = (filter: any, tasks: Task[], ganttStartDate: Date, ganttEndDate: Date, viewMode: ViewMode) => {
    let newStartDate: Date = filter && filter.startDate ? filter.startDate : new Date();
    let newEndDate: Date = new Date(newStartDate);

    switch (viewMode) {
        case ViewMode.Month:
            newEndDate.setDate(newEndDate.getDate() + 5 * 7 - 1);
            break;
        case ViewMode.Week:
            newEndDate.setDate(newEndDate.getDate() + 6);
            break;
        case ViewMode.Day:
            newEndDate.setDate(newEndDate.getDate() + 1);
            break;
        case ViewMode.QuarterDay:
            newStartDate = startOfDate(ganttStartDate, 'day');
            newEndDate = startOfDate(ganttStartDate, 'day');
            newStartDate = addToDate(newStartDate, -0.25, 'day');
            newEndDate = addToDate(newEndDate, 0.25, 'day');
            newEndDate = addToDate(newEndDate, -1, 'millisecond'); // Adjust to have a range of 0.5 day (12 hours)
            break;
        case ViewMode.HalfDay:
            newStartDate = startOfDate(ganttStartDate, 'day');
            newEndDate = startOfDate(ganttStartDate, 'day');
            newStartDate = addToDate(newStartDate, -0.5, 'day');
            newEndDate = addToDate(newEndDate, 0.5, 'day');
            newEndDate = addToDate(newEndDate, -1, 'millisecond'); // Adjust to have a range of 1 day (24 hours)
            break;
        case ViewMode.Hour:
            newStartDate = startOfDate(ganttStartDate, 'hour');
            newEndDate = startOfDate(ganttStartDate, 'hour');
            newStartDate = addToDate(newStartDate, -1, 'hour');
            newEndDate = addToDate(newEndDate, 1, 'hour');
            newEndDate = addToDate(newEndDate, -1, 'millisecond'); // Adjust to have a range of 2 hours
            break;
        case ViewMode.TwoWeek:
            newEndDate.setDate(newEndDate.getDate() + 13);
            break;
        case ViewMode.HalfYear:
            newEndDate.setMonth(newEndDate.getMonth() + 6);
            break;
        case ViewMode.Year:
            newEndDate.setFullYear(newEndDate.getFullYear() + 1);
            break;
        default:
            newStartDate = ganttStartDate;
            newEndDate = ganttEndDate;
            break;
    }

    return [newStartDate, newEndDate];
};

export const seedDates = (startDate: Date, endDate: Date, viewMode: ViewMode) => {
    let currentDate: Date = new Date(startDate);
    const dates: Date[] = [currentDate];
    while (currentDate < endDate) {
        switch (viewMode) {
            case ViewMode.Month:
                currentDate = addToDate(currentDate, 1, 'day');
                break;
            case ViewMode.Week:
                currentDate = addToDate(currentDate, 1, 'day');
                break;
            case ViewMode.Day:
                currentDate = addToDate(currentDate, 1, 'day');
                break;
            case ViewMode.HalfDay:
                currentDate = addToDate(currentDate, 12, 'hour');
                break;
            case ViewMode.QuarterDay:
                currentDate = addToDate(currentDate, 6, 'hour');
                break;
            case ViewMode.Hour:
                currentDate = addToDate(currentDate, 1, 'hour');
                break;
            case ViewMode.TwoWeek:
                currentDate = addToDate(currentDate, 1, 'day');
                break;
            case ViewMode.HalfYear:
                currentDate = addToDate(currentDate, 1, 'hour');
                break;
            case ViewMode.Year:
                currentDate = addToDate(currentDate, 1, 'month');
                break;
            default:
                break;
        }
        dates.push(currentDate);
    }
    return dates;
};

export const getLocaleMonth = (date: Date, locale: string) => {
    let bottomValue = getCachedDateTimeFormat(locale, {
        month: 'long',
    }).format(date);
    bottomValue = bottomValue.replace(bottomValue[0], bottomValue[0].toLocaleUpperCase());
    return bottomValue;
};

export const getLocalDayOfWeek = (date: Date, locale: string, format?: 'long' | 'short' | 'narrow' | undefined) => {
    let bottomValue = getCachedDateTimeFormat(locale, {
        weekday: format,
    }).format(date);
    bottomValue = bottomValue.replace(bottomValue[0], bottomValue[0].toLocaleUpperCase());
    return bottomValue;
};

/**
 * Returns monday of current week
 * @param date date for modify
 */
const getMonday = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
};

export const getWeekNumberISO8601 = (date: Date) => {
    const tmpDate = new Date(date.valueOf());
    const dayNumber = (tmpDate.getDay() + 6) % 7;
    tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
    const firstThursday = tmpDate.valueOf();
    tmpDate.setMonth(0, 1);
    if (tmpDate.getDay() !== 4) {
        tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
    }
    const weekNumber = (1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)).toString();

    if (weekNumber.length === 1) {
        return `0${weekNumber}`;
    }
    return weekNumber;
};

export const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
};
