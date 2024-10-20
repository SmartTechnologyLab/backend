import { Trade } from '../interfaces/trade.interface';

export type GrouppedTrades = Record<Trade['ticker'], Trade[]>;
