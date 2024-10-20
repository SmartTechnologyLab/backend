import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { NormalizeTradesModule } from 'src/normalizeTrades/normalizeTrades.module';
import { NormalizeTradesService } from 'src/normalizeTrades/normalizeTrades.service';
import { NormalizeReportsModule } from 'src/normalizeReports/normalizeReports.module';
import { NormalizeReportsService } from 'src/normalizeReports/normalizeReports.service';
import { ReportReaderModule } from 'src/reportReader/reportReader.module';
import { ReportReaderService } from 'src/reportReader/reportReader.service';
import { CurrencyRateService } from 'src/currencyExchange/currencyRate.service';
import { CurrencyRateModule } from 'src/currencyExchange/currencyRate.module';
import { DateFormatModule } from 'src/dateTimeFormat/dateFormat.module';
import { DateTimeFormatService } from 'src/dateTimeFormat/dateFormat.service';

@Module({
  imports: [
    CurrencyRateModule,
    NormalizeTradesModule,
    NormalizeReportsModule,
    ReportReaderModule,
    DateFormatModule,
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    CurrencyRateService,
    NormalizeTradesService,
    NormalizeReportsService,
    ReportReaderService,
    DateTimeFormatService,
  ],
})
export class ReportModule {}
