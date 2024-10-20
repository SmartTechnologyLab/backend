import { Injectable } from '@nestjs/common';
import { NormalizeTradesService } from '../normalizeTrades/normalizeTrades.service';
import { FreedomFinanceReport } from './types/interfaces/freedomFinance.interface';
import { IbkrReport } from './types/interfaces/ibkr.interface';
import { Report } from 'src/report/types/interfaces/report.interface';
import { Trade } from 'src/report/types/interfaces/trade.interface';
import { StockExchangeEnum } from 'src/normalizeTrades/constants/enums';
import { StockExchangeType } from './types/types/stock-exchange.type';

@Injectable()
export class NormalizeReportsService {
  constructor(private normalizeTradeService: NormalizeTradesService) {}

  private MAP_STOCK_EXCHANGE_TO_REPORT_TYPE = {
    [StockExchangeEnum.FREEDOM_FINANCE]:
      this.normalizeFreedomFinanceReport.bind(this),
    [StockExchangeEnum.IBRK]: this.normalizeIBKRReport.bind(this),
  };

  getReportByStockExchange(
    report: any,
    stockExchange: StockExchangeType,
  ): Report<Trade> {
    return this.MAP_STOCK_EXCHANGE_TO_REPORT_TYPE[stockExchange](report);
  }

  private normalizeFreedomFinanceReport(
    report: FreedomFinanceReport,
  ): Report<Trade> {
    return {
      dateStart: report.date_start,
      trades: this.normalizeTradeService.getNormalizedTrades(
        StockExchangeEnum.FREEDOM_FINANCE,
        report.trades.detailed,
      ),
    };
  }

  private normalizeIBKRReport(report: IbkrReport): Report<Trade> {
    const { fromDate: dateStart } =
      report.FlexQueryResponse.FlexStatements.FlexStatement;

    return {
      dateStart,
      trades: this.normalizeTradeService.getNormalizedTrades(
        StockExchangeEnum.IBRK,
        [],
      ),
    };
  }
}
