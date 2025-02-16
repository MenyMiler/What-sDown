import Holidays from 'date-holidays';
import i18next from 'i18next';

export function initHoliday() {
    const hd = new Holidays('IL');
    const todayHolidays = hd.isHoliday(new Date());
    return todayHolidays || [];
}

function getTodayDate() {
    const newDate = new Date();

    return { date: newDate.getDate(), month: newDate.getMonth() + 1, year: newDate.getFullYear(), day: newDate.getDay() + 1 };
}

export function getCurrentDate(separator = '/') {
    const { date, month, year } = getTodayDate();

    return `${date < 10 ? `0${date}` : `${date}`}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year}`;
}

export function convertDayToText() {
    const { day } = getTodayDate();
    return i18next.t(`day.${day}`);
}

export function convertDateTolocaleString(date: string | Date) {
    return new Date(date).toLocaleDateString('he');
}
