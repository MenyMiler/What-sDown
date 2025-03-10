import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { UsersManager } from './manager';
import { updateOneRequestSchemaByGenesisId } from './validations';


export class UsersController {

    static async updateOneByGenesisId(req: TypedRequest<typeof updateOneRequestSchemaByGenesisId>, res: Response) {
        res.json(await UsersManager.updateOneByGenesisId(req.params.genesisId, req.body, req.user?.genesisId!));
    }


}