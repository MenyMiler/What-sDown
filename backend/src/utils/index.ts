export const filteredMap = <T, V>(arr: T[], func: (value: T) => { include: true; value: V } | { include: false; value?: V }, recursive?: boolean) => {
    const newArr: V[] = [];

    for (let i = 0; i < arr.length; i++) {
        const { include, value } = func(arr[i]);

        if (recursive && Array.isArray(value)) newArr.push(...filteredMap(value, func, recursive));
        else if (include) newArr.push(value);
    }

    return newArr;
};

export const getMillisecondsFromDays = (numOfDays: number) => numOfDays * 24 * 60 * 60 * 1000;
