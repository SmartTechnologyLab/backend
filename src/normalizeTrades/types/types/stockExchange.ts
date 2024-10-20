import { FreedomFinanceTrade } from 'src/normalizeReports/types/interfaces/freedomFinance.interface';
import { IbkrTrade } from 'src/normalizeReports/types/interfaces/ibkr.interface';
import { StockExchangeEnum } from 'src/normalizeTrades/constants/enums';

export type StockExchangeType =
  | StockExchangeEnum.FREEDOM_FINANCE
  | StockExchangeEnum.IBRK;

export type TradesByStockExchange = {
  [StockExchangeEnum.FREEDOM_FINANCE]: FreedomFinanceTrade[];
  [StockExchangeEnum.IBRK]: IbkrTrade[];
};
