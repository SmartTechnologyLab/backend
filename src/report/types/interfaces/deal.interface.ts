export interface Deal {
  id: symbol;
  percent: number;
  purchase: TransactionDetails;
  quantity: number;
  sale: TransactionDetails;
  ticker: string;
  total: number;
}

interface TransactionDetails {
  date: Date;
  price: number;
  sum: number;
  commission: number;
  rate: number;
  uah: number;
}
