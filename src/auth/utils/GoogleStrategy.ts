import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/auth/google/redirect`,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      console.log('Access token', accessToken);
      console.log('Refresh token', refreshToken);
      const user = await this.authService.validateUser({
        displayName: profile.displayName,
        email: profile.emails[0].value,
        accessToken,
      });

      return user || null;
    } catch (error) {
      console.error('Error validating user:', error);
      throw new UnauthorizedException('Failed to authenticate user');
    }
  }
}
