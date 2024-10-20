import { StockExchangeEnum } from 'src/normalizeTrades/constants/enums';

export type StockExchangeType =
  | StockExchangeEnum.FREEDOM_FINANCE
  | StockExchangeEnum.IBRK;
