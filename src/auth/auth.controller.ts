import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guards';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt.quards';
import { ApiTags } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    const user = await this.authService.validateUser(req.body);
    const tokens = await this.authService.generateTokens(user);
    return tokens;
  }

  @Get('status')
  @UseGuards(JwtGuard)
  status(@Req() req: Request) {
    console.log('Inside AuthController status method');
    console.log(req.user);
    return req.user;
  }

  @Post('create')
  createUser(@Body() createDto: AuthLoginDto) {
    return this.authService.createUser(createDto);
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Body() refreshDto: RefreshDto) {
    const tokens = await this.authService.refreshToken(refreshDto.refreshToken);
    return tokens;
  }
}
