import { z } from 'zod';


const typeUserField = z
    .object({
        type: z.enum(['ADMIN', 'USER']),
    })
    .required();






// PUT /api/users/:genesisId
export const updateOneRequestSchemaByGenesisId = z.object({
    body: typeUserField,
    query: z.object({}),
    params: z.object({
        genesisId: z.string(),
    }).required(),
});

