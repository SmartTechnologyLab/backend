export interface DealReport<T> {
  total: number;
  totalTaxFee: number;
  totalMilitaryFee: number;
  deals: T[];
}
