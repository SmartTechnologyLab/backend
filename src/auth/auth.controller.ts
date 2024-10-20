import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guards';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt.quards';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return req.user;
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
}
