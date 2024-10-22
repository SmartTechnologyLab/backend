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
      return findUser;
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
      const tokens = this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  generateTokens(user: User) {
    const { password, ...userData } = user;
    const accessToken = this.jwtService.sign(userData);
    const refreshToken = this.jwtService.sign(userData, { secret: 'refreshSecretKey', expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}
