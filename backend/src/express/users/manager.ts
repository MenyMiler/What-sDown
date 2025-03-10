import { UsersService } from '../users/service';
import { User } from './interface';

export class UsersManager {
    static async updateOneByGenesisId(genesisId: string, update: Partial<User>, genesisIdAdmin: string): Promise<User> {
        const user = await UsersService.getByGenesisId(genesisIdAdmin);
        if (user.status) {
            return await UsersService.updateOneByGenesisId(genesisId, update);
        }

        throw new Error('user is not admin!!!!!!!!!!!!!!, only admin can update user');
    }
}
