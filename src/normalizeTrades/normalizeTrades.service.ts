import { Injectable } from '@nestjs/common';
import { IbkrTrade } from 'src/normalizeReports/types/interfaces/ibkr.interface';
import { Trade } from 'src/report/types/interfaces/trade.interface';
import { FreedomFinanceTrade } from 'src/normalizeReports/types/interfaces/freedomFinance.interface';
import { StockExchangeType } from 'src/normalizeReports/types/types/stock-exchange.type';
import { StockExchangeEnum } from './constants/enums';
import { TradesByStockExchange } from './types/types/stockExchange';

@Injectable()
export class NormalizeTradesService {
  constructor() {}

  private MAP_STOCK_EXCHANGE_TO_TRADE_TYPE = {
    [StockExchangeEnum.FREEDOM_FINANCE]:
      this.normalizedFreedomFinanceTrades.bind(this),
    [StockExchangeEnum.IBRK]: this.normalizedIbkrTrades.bind(this),
  };

  getNormalizedTrades(
    stockExchange: StockExchangeType,
    trades: TradesByStockExchange[StockExchangeEnum],
  ): Trade[] {
    return this.MAP_STOCK_EXCHANGE_TO_TRADE_TYPE[stockExchange](trades);
  }

  private normalizedFreedomFinanceTrades(
    trades: Array<FreedomFinanceTrade | Trade>,
  ): Trade[] {
    const conformingTrades: Trade[] = trades.filter(this.isITrade);
    const nonConformingTrades = trades.filter(
      (trade) => !this.isITrade(trade),
    ) as FreedomFinanceTrade[];

    const mappedTrades: Trade[] = nonConformingTrades.map((trade) => ({
      ticker: trade.instr_nm?.split('.').at(0),
      price: trade.p,
      commission: trade.commission,
      operation: trade.operation,
      quantity: trade.q,
      date: trade.date,
      currency: trade.curr_c,
    }));

    return [...conformingTrades, ...mappedTrades];
  }

  private normalizedIbkrTrades(trades: Array<IbkrTrade | Trade>): Trade[] {
    const conformingTrades: Trade[] = trades.filter(this.isITrade);
    const nonConformingTrades = trades.filter(
      (trades) => !this.isITrade(trades),
    ) as IbkrTrade[];

    const normalizedTrades: Trade[] = nonConformingTrades.map((trade) => ({
      ticker: trade.symbol,
      currency: trade.currency,
      date: trade.dateTime,
      operation: 'buy',
      price: 0,
      commission: 0,
      quantity: trade.amount,
    }));

    return [...conformingTrades, ...normalizedTrades];
  }

  isITrade(trade: unknown): trade is Trade {
    return trade.hasOwnProperty('ticker');
  }
}
