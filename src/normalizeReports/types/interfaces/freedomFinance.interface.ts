import { OperationType } from 'src/report/types/types/operation.type';
import { FreedomFinanceCorporateActionTypeId } from '../types/freedom-finance.type';

export interface FreedomFinanceCorporateAction {
  date: string;
  type: string;
  type_id: FreedomFinanceCorporateActionTypeId;
  amount: number;
  ticker: string;
  isin: string;
  currency: string;
}

export interface FreedomFinanceTrade {
  date: string;
  p: number;
  q: number;
  commission: number;
  operation: OperationType;
  instr_nm: string;
  curr_c: string;
}

export interface FreedomFinanceReport {
  date_start: string;
  corporate_actions: {
    detailed: FreedomFinanceCorporateAction[];
  };
  trades: {
    detailed: FreedomFinanceTrade[];
  };
}
