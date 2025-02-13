import _ from 'lodash';

type Json = { [key: string]: any };

interface Change {
    path: string;
    oldValue: any;
    newValue: any;
}

const normalizeValue = (value: any) => {
    if (Array.isArray(value)) {
        value.forEach((valueInArr) => {
            if (valueInArr instanceof Date) {
                return valueInArr.toISOString();
            }
            return valueInArr;
        });
    }
    if (value instanceof Date) {
        return value.toISOString();
    }

    return value;
};

export const compareJson = (oldJson: Json, newJson: Json, path: string = ''): Change[] => {
    const changes: Change[] = [];
    const allKeys = _.union(_.keys(oldJson), _.keys(newJson));

    allKeys.forEach((key) => {
        let oldValue = _.get(oldJson, key);
        let newValue = _.get(newJson, key);

        oldValue = normalizeValue(oldValue);
        newValue = normalizeValue(newValue);
        const currPath = path ? `${path}.${key}` : key;

        // eslint-disable-next-line prettier/prettier
        if (!_.isEqual(oldValue, newValue) && (oldValue || newValue) && newValue && currPath !== '_id') {
            changes.push({
                path: currPath,
                oldValue,
                newValue,
            });
        }
    });

    return changes;
};
