import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Test endpoint')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Test endpoint',
    schema: {
      example: 'Hello world',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
