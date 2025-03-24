import { UsersService } from '../users/service';
import { typeUser, User } from './interface';

export class UsersManager {
    static async updateOneByGenesisId(genesisId: string, update: Partial<User>, genesisIdAdmin: string): Promise<User> {
        if (genesisId === genesisIdAdmin) {
            throw new Error('you cannot update yourself');
        }

        const user = await UsersService.getByGenesisId(genesisIdAdmin);
        if (user.type === typeUser.admin) {
            return await UsersService.updateOneByGenesisId(genesisId, update);
        }

        throw new Error('user is not admin!!!!!!!!!!!!!!, only admin can update user');
    }
}
