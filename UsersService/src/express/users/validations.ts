import { z } from 'zod';
import { zodMongoObjectId } from '../../utils/zod.js';

const mongoObjectId = z
    .object({
        _id: zodMongoObjectId,
    })
    .required();

const genesisId = z.object({
    genesisId: z.string(),
});

const typeUserField = z
    .object({
        type: z.enum(['ADMIN', 'USER']),
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
        .merge(typeUserField),
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
});

// GET /api/users/:GenesisId
export const getByGenesisIdRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: genesisId.required(),
});

// POST /api/users
export const createOneRequestSchema = z.object({
    body: typeUserField.required().merge(genesisId.required()),
    query: z.object({}),
    params: z.object({}),
});

// PUT /api/users/:id
export const updateOneRequestSchema = z.object({
    body: mongoObjectId.partial().merge(typeUserField),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

// PUT /api/users/:genesisId
export const updateOneRequestSchemaByGenesisId = z.object({
    body: typeUserField.required(),
    query: z.object({}),
    params: z
        .object({
            genesisId: z.string(),
        })
        .required(),
});

// DELETE /api/users/:id
export const deleteOneRequestSchema = z.object({
    body: z.object({}),
    query: z.object({}),
    params: z.object({
        id: zodMongoObjectId,
    }),
});

//GET /api/users/notAdmins?page=1&pageSize=10
export const getNotAdminsRequestSchema = z.object({
    body: z.object({}),
    query: z
    .object({
        page: z.coerce.number().min(1).default(1),
        pageSize: z.coerce.number().min(1).max(100).default(10),
    })
    .partial(),
    params: z.object({}),

});
