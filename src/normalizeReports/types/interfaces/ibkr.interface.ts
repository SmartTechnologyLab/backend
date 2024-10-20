export interface IbkrTrade {
  accountId: string;
  currency: string;
  assetCategory: string;
  symbol: string;
  dateTime: string;
  amount: number;
}

export interface IbkrReport {
  FlexQueryResponse: {
    FlexStatements: {
      FlexStatement: {
        CashTransactions: {
          CashTransaction: IbkrTrade[];
        };
        fromDate: string;
        toDate: string;
      };
    };
  };
}
