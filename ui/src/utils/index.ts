import i18next from 'i18next';

export const getCookie = (cookieName: string) => {
    return document?.cookie
        .split('; ')
        .find((row) => row.startsWith(cookieName))
        ?.split('=')[1];
};

export const dateToString = (date: Date | null) => {
    if (!date) return i18next.t('yearlyGraph.noDate');
    const dateString = new Date(date!).toLocaleDateString('he');
    const daysIndexes = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    return `יום ${i18next.t(`yearlyGraph.days.${daysIndexes[new Date(date!).getDay()]}`)}', ${dateString} `;
};

export const filteredMap = <T, V>(arr: T[], func: (value: T) => { include: true; value: V } | { include: false; value?: V }, recursive?: boolean) => {
    const newArr: V[] = [];

    for (let i = 0; i < arr.length; i++) {
        const { include, value } = func(arr[i]);

        if (recursive && Array.isArray(value)) newArr.push(...filteredMap(value, func, recursive));
        else if (include) newArr.push(value);
    }

    return newArr;
};
