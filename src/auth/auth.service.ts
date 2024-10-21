import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User';
import { Repository } from 'typeorm';
import { AuthLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async validateUser({ username, password }: AuthLoginDto) {
    const findUser = await this.userRepository.findOneBy({ username });
    if (!findUser) return null;

    if (password === findUser.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = findUser;
      return this.jwtService.sign(user);
    }
  }
  createUser(createDto: AuthLoginDto) {
    const newUser = this.userRepository.create(createDto);
    return this.userRepository.save(newUser);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: 'refreshSecretKey' });
      const user = await this.userRepository.findOneBy({ id: payload.id });
      if (!user) {
        throw new Error('User not found');
      }
      const { password, ...userData } = user;
      const newAccessToken = this.jwtService.sign(userData);
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
