import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/SupabaseAuthGuard';
import { SupabaseStrategy } from './guards/SupabaseStrategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseStrategy, SupabaseAuthGuard],
})
export class AuthModule {}
