import { z } from 'zod';
import { agGridRequestSchema } from './zod';

export enum basicFilterOperationTypes {
    equals = 'equals',
    notEqual = 'notEqual',
    blank = 'blank',
    notBlank = 'notBlank',
}

export enum numberFilterOperationTypes {
    lessThan = 'lessThan',
    lessThanOrEqual = 'lessThanOrEqual',
    greaterThan = 'greaterThan',
    greaterThanOrEqual = 'greaterThanOrEqual',
    inRange = 'inRange',
}

export enum textFilterOperationTypes {
    contains = 'contains',
    notContains = 'notContains',
    startsWith = 'startsWith',
    endsWith = 'endsWith',
}

export enum filterTypes {
    text = 'text',
    number = 'number',
    date = 'date',
    set = 'set',
}

export enum sortDirection {
    ascending = 'asc',
    descending = 'desc',
}

export type AgGridRequest = z.infer<typeof agGridRequestSchema>;

export interface AgGridSearchResult<T> {
    rows: T[];
    lastRowIndex: number;
}
