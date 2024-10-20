import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { NormalizeTradesModule } from './normalizeTrades/normalizeTrades.module';
import { NormalizeReportsModule } from './normalizeReports/normalizeReports.module';
import { HealthController } from './health/health.controller';
import { ConfigModule } from '@nestjs/config';
import { CurrencyRateModule } from './currencyExchange/currencyRate.module';
import { DateFormatModule } from './dateTimeFormat/dateFormat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ReportModule,
    CurrencyRateModule,
    NormalizeTradesModule,
    NormalizeReportsModule,
    DateFormatModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
