import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.straqtegy';
import { JwtStrategy, RefreshTokenStrategy } from './strategies/jwt.strategy';
import { RefreshGuard } from './guards/refresh.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'qwerty123',
      signOptions: { expiresIn: '1m' },
    }),
    JwtModule.register({
      secret: 'refreshSecretKey',
      signOptions: { expiresIn: '2m' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    RefreshGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
