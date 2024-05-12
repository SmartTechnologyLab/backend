import { BadRequestException, Injectable } from '@nestjs/common';
import { IUser } from './types/IUser';
import { SupabaseService } from 'src/supabase/supabase.service';
import { TablesName } from 'src/supabase/utils/tablesName';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async validateUser(userInfo: IUser) {
    try {
      // Updating new access token to DB
      await this.supabaseService.updateData(
        TablesName.USERS,
        { accessToken: userInfo.accessToken },
        'email',
        userInfo.email,
      );

      // Figure out if user exists in DB
      const existingUser = await this.supabaseService.findData(
        TablesName.USERS,
        'email',
        userInfo.email,
      );

      if (existingUser) {
        return existingUser;
      }

      // If no user in DB, we set it
      await this.supabaseService.insertData(TablesName.USERS, userInfo);

      const newUser = await this.supabaseService.findData(
        TablesName.USERS,
        'email',
        userInfo.email,
      );

      return newUser;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed user validation:' + error);
    }
  }

  async findUserById(id: string) {
    const findedUser = await this.supabaseService.findData(
      TablesName.USERS,
      'id',
      id,
    );

    return findedUser;
  }
}
