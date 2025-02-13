import { z } from 'zod';
import { populate, zodMongoObjectId } from '../../utils/zod';
import { agGridRequestSchema } from '../../utils/agGrid/zod';

const requiredFields = z
    .object({
        genesisId: zodMongoObjectId,
    })
    .required();

// GET /api/users
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
            populate,
        })
        .merge(requiredFields.partial()),
    params: z.object({}),
});

// GET /api/users/:id
export const getByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({ populate }),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// POST /api/users/search
export const searchRequestSchema = z.object({
    body: agGridRequestSchema,
    query: z.object({ populate }),
    params: z.object({}),
});

// POST /api/users
export const createOneRequestSchema = z.object({
    body: requiredFields,
    query: z.object({ populate }),
    params: z.object({}),
});

// DELETE /api/users/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        _id: zodMongoObjectId,
    }),
});

// PUT /api/users/:id
export const updateOneRequestSchema = z.object({
    body: requiredFields.partial(),
    query: z.object({ populate }),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// DELETE /api/users/genesisId/:id/baseId/:baseId
export const deleteUserByGenesisIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
        baseId: zodMongoObjectId,
    }),
});
