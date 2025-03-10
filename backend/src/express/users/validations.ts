import { z } from 'zod';


const statuslField = z
    .object({
        status: z.boolean(),
    })
    .required();






// PUT /api/users/:genesisId
export const updateOneRequestSchemaByGenesisId = z.object({
    body: statuslField,
    query: z.object({}),
    params: z.object({
        genesisId: z.string(),
    }).required(),
});

