import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { SessionSerilalizer } from './utils/Serializer';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, SessionSerilalizer, SupabaseService],
})
export class AuthModule {}
