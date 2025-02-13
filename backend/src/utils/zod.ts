import { Request } from 'express';
import { AnyZodObject, CustomErrorParams, z } from 'zod';
import { Prettify } from './types';

export const zodMongoObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId' });

export const populate = z.coerce.boolean().default(false);

export type TypedRequest<T extends AnyZodObject> = Prettify<Request<z.infer<T>['params'], any, z.infer<T>['body'], z.infer<T>['query']>>;



export const dateGreaterThanDate = (
    firstDate: string,
    secondDate: string,
    areDatesOptional: boolean = true,
): [(val: any) => boolean, CustomErrorParams] => [
    (val) =>
        val[firstDate] !== undefined && val[secondDate] !== undefined ? val[firstDate].getTime() <= val[secondDate].getTime() : areDatesOptional,
    { message: `${firstDate} must be less than or equal to ${secondDate}` },
];

export const personalNumberRegex = /^\d{7}$/;

export const personalNumberErrorMessage = 'personal number must be a 7-digit number';
