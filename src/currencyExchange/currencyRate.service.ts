import { Injectable } from '@nestjs/common';
import { CurrencyExchangeResponse } from './types/interfaces/currency-exchange-response.interface';
import { NBUCurrencyExchange } from './types/interfaces/nbu-currency-exchange.interface';
import { DateTimeFormatService } from 'src/dateTimeFormat/dateFormat.service';

@Injectable()
export class CurrencyRateService {
  constructor(private dateTimeFormatService: DateTimeFormatService) {}

  private removeDashesFromDate(date: string) {
    return date.replace(/-/g, '');
  }

  private getDateForRate(date: string) {
    const formattedDate = this.dateTimeFormatService.format(date, 'yyyy-MM-dd');

    return this.removeDashesFromDate(formattedDate);
  }

  async getCurrencyExchange(
    currency: string,
    date: string,
  ): Promise<CurrencyExchangeResponse> {
    try {
      const formattedDate = this.getDateForRate(date);

      const response = await fetch(
        `${process.env.NBU_API_URL}?valcode=${currency}&date=${formattedDate}&json`,
      );

      const [data]: NBUCurrencyExchange[] = await response.json();

      if (!response.ok) {
        throw new Error();
      }

      return {
        currency: data.cc,
        rate: data.rate,
        exchangedate: data.exchangedate,
      };
    } catch (error) {
      throw new Error();
    }
  }
}
