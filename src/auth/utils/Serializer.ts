/* eslint-disable @typescript-eslint/ban-types */
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { IUser } from '../types/IUser';

@Injectable()
export class SessionSerilalizer extends PassportSerializer {
  constructor(private readonly authservice: AuthService) {
    super();
  }

  serializeUser(user: IUser, done: Function) {
    console.log('Serializable user');
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.authservice.findUserById(payload.id);
    console.log('Deserialize User');
    return user ? done(null, user) : done(null, null);
  }
}
