import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { UsersManager } from './manager';
import { updateOneRequestSchemaByGenesisId } from './validations';
import { typeUser } from './interface';


export class UsersController {

    // static async updateOneByGenesisId(req: TypedRequest<typeof updateOneRequestSchemaByGenesisId>, res: Response) {
    //     res.json(await UsersManager.updateOneByGenesisId(req.params.genesisId, req.body, req.user?.genesisId!));
    // }

    static async updateOneByGenesisId(req: TypedRequest<typeof updateOneRequestSchemaByGenesisId>, res: Response) {
        res.json(await UsersManager.updateOneByGenesisId(req.params.genesisId, {type: req.body.type as unknown as typeUser}, req.user?.genesisId!));
    }
    
}