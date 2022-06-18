interface IKeys {
    apiKey: string;
    secretKey: string;
}
declare type AccountBalanceType = "SPOT" | "MARGIN" | "FUTURES";
declare class Asset {
    asset: string;
    free: string;
    locked: string;
}
declare class Balance extends Asset {
    free_in_btc: string;
    locked_in_btc: string;
}
interface AccountInfo {
    accountType: AccountBalanceType;
    canTrade: boolean;
    canWithdraw: boolean;
    canDeposit: boolean;
    updateTime: number;
    balances: Array<Asset>;
    permissions: Array<string>;
}
interface Ticker {
    symbol: string;
    price: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    prevClosePrice: string;
    lastPrice: string;
    lastQty: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}
export { IKeys, AccountBalanceType, AccountInfo, Ticker, Balance, };
