import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod.js';

const requiredFields = z
    .object({
        name: z.string(),
    })
    .required();

const optionalFields = z
    .object({
        status: z.boolean(),
    })
    .partial();

// GET /api/systems
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
        })
        .merge(requiredFields.partial())
        .merge(optionalFields),
    params: z.object({}),
});

// GET /api/systems/count
export const getCountRequestSchema = z.object({
    body: z.object({}),
    query: requiredFields.partial().merge(optionalFields),
    params: z.object({}),
});

// GET /api/systems/:id
export const getByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// POST /api/systems
export const createOneRequestSchema = z.object({
    body: requiredFields.merge(optionalFields.required()),
    query: z.object({}),
    params: z.object({}),
});

// POST /api/systems
export const createManyRequestSchema = z.object({
    body: z.array(requiredFields.merge(optionalFields.required())),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/systems/:id
export const updateOneRequestSchema = z.object({
    body: requiredFields.partial().merge(optionalFields),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// DELETE /api/systems/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});
