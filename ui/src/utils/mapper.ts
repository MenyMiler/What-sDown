export const mapperForIdAndName = (arrayOfObjects: any[]) => arrayOfObjects.map(({ _id, name }) => ({ _id, name }));

export const mapperForName = (arrayOfObjects: any[]): string[] => arrayOfObjects.map(({ name }) => name);
