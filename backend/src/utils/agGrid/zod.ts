import { z } from 'zod';
import { basicFilterOperationTypes, filterTypes, numberFilterOperationTypes, sortDirection, textFilterOperationTypes } from './interface';

const { blank, notBlank, ...basicFilterOperationTypesOtherThanBlankAndNotBlank } = basicFilterOperationTypes;

const { inRange, ...numberFilterOperationTypesOtherThanInRange } = numberFilterOperationTypes;

const agGridSetFilterSchema = z.object({
    filterType: z.literal(filterTypes.set),
    values: z.array(z.string().nullable()).default([]),
});

const agGridNumberFilterSchema = z.intersection(
    z.object({
        filterType: z.literal(filterTypes.number),
        type: z.union([z.nativeEnum(basicFilterOperationTypes), z.nativeEnum(numberFilterOperationTypes)]),
        filter: z.number().optional(),
    }),
    z.discriminatedUnion('type', [
        z.object({
            type: z.nativeEnum({ ...basicFilterOperationTypesOtherThanBlankAndNotBlank, ...numberFilterOperationTypesOtherThanInRange }),
            filter: z.number(),
        }),
        z.object({
            type: z.enum([blank, notBlank]),
        }),
        z.object({
            type: z.literal(numberFilterOperationTypes.inRange),
            filterTo: z.number(),
        }),
    ]),
);

const agGridTextFilterSchema = z.intersection(
    z.object({
        filterType: z.literal(filterTypes.text),
        type: z.union([z.nativeEnum(basicFilterOperationTypes), z.nativeEnum(textFilterOperationTypes)]),
        filter: z.string().optional(),
    }),
    z.discriminatedUnion('type', [
        z.object({
            type: z.nativeEnum({ ...basicFilterOperationTypesOtherThanBlankAndNotBlank, ...textFilterOperationTypes }),
            filter: z.string(),
        }),
        z.object({
            type: z.enum([blank, notBlank]),
        }),
    ]),
);

const agGridDateFilterSchema = z.intersection(
    z.object({
        filterType: z.literal(filterTypes.date),
        type: z.union([z.nativeEnum(basicFilterOperationTypes), z.nativeEnum(numberFilterOperationTypes)]),
        dateFrom: z.string().nullable(),
    }),
    z.discriminatedUnion('type', [
        z.object({
            type: z.nativeEnum({ ...basicFilterOperationTypes, ...numberFilterOperationTypesOtherThanInRange }),
            dateTo: z.string().nullish(),
        }),
        z.object({
            type: z.literal(numberFilterOperationTypes.inRange),
            dateTo: z.string(),
        }),
    ]),
);

export const agGridRequestSchema = z.object({
    startRow: z.number(),
    endRow: z.number(),
    filterModel: z.record(z.union([agGridTextFilterSchema, agGridDateFilterSchema, agGridNumberFilterSchema, agGridSetFilterSchema])),
    sortModel: z.array(
        z.object({
            colId: z.string(),
            sort: z.nativeEnum(sortDirection),
        }),
    ),
});
