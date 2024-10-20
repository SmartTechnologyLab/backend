import {
  BadRequestException,
  Controller,
  Get,
  Injectable,
  Query,
} from '@nestjs/common';
import { CurrencyRateService } from './currencyRate.service';

@Injectable()
@Controller('currency-rate')
export class CurrencyRateController {
  constructor(private currencyExchangeService: CurrencyRateService) {}

  @Get()
  async getUahCurrenyRate(
    @Query('currency') currency: string,
    @Query('date') date: string,
  ) {
    try {
      const rate = await this.currencyExchangeService.getCurrencyExchange(
        currency,
        date,
      );
      console.log(rate);
      return rate;
    } catch (error) {
      throw new BadRequestException('Error while getting currency rate');
    }
  }
}
