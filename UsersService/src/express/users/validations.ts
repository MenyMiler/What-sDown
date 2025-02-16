import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod.js';

const mongoObjectId = z
    .object({
        _id: zodMongoObjectId,
    })
    .required();

const genesisId = z.object({
    genesisId: z.string(),
})

const statuslField = z
    .object({
        status: z.boolean(),
    })
    .partial();

// GET /api/users
export const getByQueryRequestSchema = z.object({
    body: z.object({}),
    query: z
        .object({
            step: z.coerce.number().min(0).default(0),
            limit: z.coerce.number().optional(),
        })
        .merge(mongoObjectId.partial())
        .merge(statuslField),
    params: z.object({}),
});

// GET /api/users/count
export const getCountRequestSchema = z.object({
    body: z.object({}),
    query: statuslField,
    params: z.object({}),
});

// GET /api/users/:id
export const getByIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

//GET /api/users/:genesisId
export const getByGenesisGenesisIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        genesisId: z.string(),
    }),
})

// GET /api/users/:GenesisId
export const getByGenesisIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: genesisId.required(),
});

// POST /api/users
export const createOneRequestSchema = z.object({
    body: statuslField.required().merge(genesisId.required()),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/users/:id
export const updateOneRequestSchema = z.object({
    body: mongoObjectId.partial().merge(statuslField),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// DELETE /api/users/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});
