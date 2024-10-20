import { OperationType } from '../types/operation.type';

export interface Trade {
  date: string;
  price: number;
  commission: number;
  operation: OperationType;
  quantity: number;
  ticker: string;
  currency: string;
}
