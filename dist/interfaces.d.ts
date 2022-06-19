export interface IKeys {
    apiKey: string;
    secretKey: string;
}
export declare type AccountBalanceType = "SPOT" | "MARGIN" | "FUTURES";
export declare class Asset {
    asset: string;
    free: string;
    locked: string;
    savings: string;
}
export declare class Balance extends Asset {
    free_in_btc: string;
    locked_in_btc: string;
}
export interface AccountInfo {
    accountType: AccountBalanceType;
    canTrade: boolean;
    canWithdraw: boolean;
    canDeposit: boolean;
    updateTime: number;
    balances: Array<Asset>;
    permissions: Array<string>;
}
export interface Ticker {
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
export interface Data {
    balances: Asset[];
    totalAssetOfBtc: string;
}
export interface SnapshotVos {
    data: Data;
    type: string;
    updateTime: number;
}
export interface DailyAccountSnapshot {
    code: number;
    msg: string;
    snapshotVos: SnapshotVos[];
}
export interface OrderBook {
    lastUpdateId: number;
    bids: string[][];
    asks: string[][];
}
