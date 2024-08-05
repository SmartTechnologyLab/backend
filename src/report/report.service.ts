import { Injectable } from '@nestjs/common';
import { groupBy } from 'ramda';
import { CurrencyExchangeService } from 'src/currencyExchange/currencyExchange.service';
import {
  Deal,
  DealOptions,
  ICorporateAction,
  IDealReport,
  IDealShort,
  IReport,
  ITrades,
} from './types';

@Injectable()
export class ReportService {
  constructor(private currencyExchangeService: CurrencyExchangeService) {}

  readReport(file: Express.Multer.File): IReport {
    try {
      const reportContent = file.buffer.toString('utf-8');
      return JSON.parse(reportContent);
    } catch (error) {
      throw new Error(error);
    }
  }

  groupDealsByTicker(deals: ITrades[]): { [key: string]: ITrades[] } {
    const modifiedDeals = deals.map((deal) => {
      const ticker = deal.instr_nm.split('.').at(0);
      return { ...deal, instr_nm: ticker };
    });

    return groupBy((deal: ITrades) => deal.instr_nm, modifiedDeals);
  }

  async getReportExtended(report: ITrades[], isPrevDeal?: boolean) {
    const deals: Deal[] = [];
    const remainedPurchaseDeals: ITrades[] = [];

    const groupedDeals = this.groupDealsByTicker(report);

    for (const ticker in groupedDeals) {
      let buyQueue: ITrades[] = [];
      let sellComission = 0;
      for (const [index, deal] of Object.entries(groupedDeals[ticker])) {
        if (deal.operation === 'buy' && deal.q > 0) {
          const existingDeal = this.findDealByDateAndPrice(buyQueue, deal);
          if (existingDeal) {
            existingDeal.q += deal.q;
            existingDeal.commission += deal.commission;
          } else {
            buyQueue.push(deal);
          }
        } else if (deal.operation === 'sell' && buyQueue.length > 0) {
          sellComission = deal.commission / deal.q;

          for (const purchaseDeal of buyQueue) {
            if (deal.q >= purchaseDeal.q) {
              const newDeal = await this.setDeal(
                deals,
                purchaseDeal,
                deal,
                isPrevDeal,
                sellComission,
              );

              deals.push(newDeal);
            }
          }

          buyQueue = buyQueue.filter((purchaseDeal) => purchaseDeal.q > 0);

          while (
            deal.q > 0 &&
            (buyQueue.some((b) => b.q > 0) ||
              groupedDeals[ticker].find(
                (d, indx) => d.operation === 'buy' && indx > +index,
              ))
          ) {
            const foundShortBuy = buyQueue.some((b) => b.q > 0)
              ? buyQueue.filter((b) => b.q > 0).at(0)
              : groupedDeals[ticker].find(
                  (d, indx) => d.operation === 'buy' && indx > +index,
                );

            if (foundShortBuy && foundShortBuy.q > 0) {
              const newDeal = await this.setDeal(
                deals,
                foundShortBuy,
                deal,
                isPrevDeal,
                sellComission,
              );

              deals.push(newDeal);
            }
          }
        } else if (
          deal.operation === 'sell' &&
          buyQueue.length === 0 &&
          groupedDeals[ticker].find(
            (t, ind) => t.operation === 'buy' && t.q > 0 && +index < ind,
          )
        ) {
          sellComission = deal.commission / deal.q;

          const foundShortBuy = groupedDeals[ticker].find(
            (t, ind) => t.operation === 'buy' && t.q > 0 && +index < ind,
          );

          if (foundShortBuy) {
            const newDeal = await this.setDeal(
              deals,
              foundShortBuy,
              deal,
              isPrevDeal,
              sellComission,
            );

            deals.push(newDeal);
          }
        }
        sellComission = 0;
      }

      remainedPurchaseDeals.push(...buyQueue.filter((deal) => deal.q > 0));
    }

    const total = deals.reduce((acc, deal) => acc + deal.total, 0);

    const totalTaxFee = this.getTotalTaxFee(total);

    const totalMilitaryFee = this.getMilitaryFee(total);

    return isPrevDeal
      ? remainedPurchaseDeals
      : {
          total,
          totalTaxFee,
          totalMilitaryFee,
          deals: deals.sort((a, b) => a.ticker.localeCompare(b.ticker)),
        };
  }

  async setDeal(
    deals: Deal[],
    purchaseDeal: ITrades,
    sellDeal: ITrades,
    isPrevDeal: boolean,
    sellComission?: number,
  ): Promise<Deal> {
    const [purchaseRate, saleRate] = await this.fetchPurchaseAndSellRate(
      purchaseDeal,
      sellDeal,
      isPrevDeal,
    );

    const deal = this.getDeal({
      ticker: purchaseDeal.instr_nm,
      purchaseCommission: purchaseDeal.commission,
      purchaseDate: new Date(purchaseDeal.date),
      purchasePrice: purchaseDeal.p,
      purchaseRate,
      quantity: purchaseDeal.q,
      saleCommission: sellComission * purchaseDeal.q,
      saleDate: new Date(sellDeal.date),
      salePrice: sellDeal.p,
      saleRate,
    });

    const quantityToProcess = Math.min(purchaseDeal.q, sellDeal.q);
    sellDeal.q -= quantityToProcess;
    purchaseDeal.q -= quantityToProcess;

    return deal;
  }

  async getReport(report: ITrades[]): Promise<IDealReport<IDealShort>> {
    const trades = (await this.getReportExtended(report)) as IDealReport<Deal>;

    const deals = Object.values(
      trades.deals.reduce(
        (acc, deal) => {
          if (!acc[deal.ticker]) {
            acc[deal.ticker] = deal;
          } else {
            acc[deal.ticker].sale.uah += deal.sale.uah;
            acc[deal.ticker].purchase.uah += deal.purchase.uah;
            acc[deal.ticker].total += deal.total;
          }
          return acc;
        },
        {} as Record<string, Deal>,
      ),
    );

    return {
      total: trades.total,
      totalTaxFee: trades.totalTaxFee,
      totalMilitaryFee: trades.totalMilitaryFee,
      deals: deals.map((deal) => ({
        ticker: deal.ticker,
        total: deal.total,
        percent: deal.percent,
        purchaseUAH: deal.purchase.uah,
        saleUAH: deal.sale.uah,
      })),
    };
  }

  async fetchPurchaseAndSellRate(
    purchaseDeal: ITrades,
    sellDeal: ITrades,
    isPrevDeal?: boolean,
  ) {
    const [{ rate: purchaseRate }, { rate: sellRate }] = await Promise.all([
      !isPrevDeal &&
        this.currencyExchangeService.getCurrencyExchange(
          purchaseDeal.curr_c,
          purchaseDeal.date,
        ),
      !isPrevDeal &&
        this.currencyExchangeService.getCurrencyExchange(
          sellDeal.curr_c,
          sellDeal.date,
        ),
    ]);

    return [purchaseRate, sellRate];
  }

  findDealByDateAndPrice(deals: ITrades[], currentDeal: ITrades) {
    return deals.find(
      (deal) =>
        this.currencyExchangeService.formatDateForCurrencyExchange(
          deal.date,
        ) ===
          this.currencyExchangeService.formatDateForCurrencyExchange(
            currentDeal.date,
          ) && deal.p === currentDeal.p,
    );
  }

  getTotalTaxFee(total: number) {
    if (total <= 0) {
      return 0;
    }

    return total * 0.18;
  }

  getMilitaryFee(total: number) {
    if (total <= 0) {
      return 0;
    }

    return total * 0.015;
  }

  getDeal({
    ticker,
    quantity,
    purchaseCommission,
    purchaseDate,
    purchasePrice,
    purchaseRate,
    saleCommission,
    saleDate,
    salePrice,
    saleRate,
  }: DealOptions = {}) {
    const purchaseSum = purchasePrice * quantity;
    const _purchaseCommission = purchaseCommission || purchaseSum;
    const saleSum = salePrice * quantity;
    const _saleCommission = saleCommission || saleSum;
    const purchaseUah =
      (purchaseSum + _purchaseCommission) * purchaseRate +
      _saleCommission * saleRate;
    const saleUah = saleSum * saleRate;

    return {
      id: Symbol(),
      purchase: {
        commission: _purchaseCommission,
        date: purchaseDate,
        price: purchasePrice,
        rate: purchaseRate,
        sum: purchaseSum,
        uah: purchaseUah,
      },
      quantity: quantity,
      sale: {
        commission: _saleCommission,
        date: saleDate,
        price: salePrice,
        rate: saleRate,
        sum: saleSum,
        uah: saleUah,
      },
      ticker: ticker,
      total: saleUah - purchaseUah,
      percent: saleUah / purchaseUah - 1,
    };
  }

  async calculateDividends(file: Express.Multer.File) {
    const corporateActions = this.readReport(file).corporate_actions
      .detailed as ICorporateAction[];

    const filteredActionsByDividend = corporateActions.filter(
      (action) => action.type_id === 'dividend',
    );

    const dividends = await Promise.all(
      filteredActionsByDividend.map(async (dividend) => {
        const { rate } = await this.currencyExchangeService.getCurrencyExchange(
          dividend.currency,
          dividend.date,
        );

        return {
          ticker: dividend.ticker,
          rate,
          price: dividend.amount,
          uah: dividend.amount * rate,
        };
      }),
    );

    const totalDividends = dividends.reduce(
      (acc, dividend) => acc + dividend.uah,
      0,
    );

    return {
      total: {
        sumUAH: totalDividends,
        taxFee: totalDividends * 0.09,
        militaryFee: totalDividends * 0.015,
      },
      dividendsResult: dividends,
    };
  }
}