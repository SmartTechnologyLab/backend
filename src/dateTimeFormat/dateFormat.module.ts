import { Module } from '@nestjs/common';
import { DateTimeFormatService } from './dateFormat.service';

@Module({
  providers: [DateTimeFormatService],
})
export class DateFormatModule {}
