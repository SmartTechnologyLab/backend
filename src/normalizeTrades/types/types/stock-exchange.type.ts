import { StockExchangeEnum } from 'src/normalizeTrades/constants/enums';

export type StockExchange =
  | StockExchangeEnum.FREEDOM_FINANCE
  | StockExchangeEnum.IBRK;
