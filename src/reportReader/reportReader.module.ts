import { Module } from '@nestjs/common';
import { ReportReaderService } from './reportReader.service';

@Module({
  providers: [ReportReaderService],
})
export class ReportReaderModule {}
