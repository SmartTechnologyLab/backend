import { sort } from 'ramda';
import { Trade } from '../types/interfaces/trade.interface';
import { Report } from '../types/interfaces/report.interface';

export const sortByDate = (report: Report<Trade>[]): Report<Trade>[] => {
  const byDate = (a: Report<Trade>, b: Report<Trade>) =>
    new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime();
  return sort(byDate, report);
};
