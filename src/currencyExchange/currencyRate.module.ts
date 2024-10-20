import { Module } from '@nestjs/common';
import { CurrencyRateController } from './currencyRate.controller';
import { CurrencyRateService } from './currencyRate.service';
import { DateFormatModule } from 'src/dateTimeFormat/dateFormat.module';
import { DateTimeFormatService } from 'src/dateTimeFormat/dateFormat.service';

@Module({
  imports: [DateFormatModule],
  providers: [CurrencyRateService, DateTimeFormatService],
  controllers: [CurrencyRateController],
})
export class CurrencyRateModule {}
