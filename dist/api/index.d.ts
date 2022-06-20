import { Method } from 'axios';
import { IKeys, AccountBalanceType, AccountInfo, Ticker, DailyAccountSnapshot, OrderBook, Balance } from '../interfaces';
export default class BinanceApi {
    private api;
    apiKey: string;
    secretKey: string;
    recvWindow: string;
    constructor({ apiKey, secretKey }: IKeys);
    /**
     * Get ticker for 24h change
     * @param pair
     * @description https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics
     */
    getTicker24h(symbol: string): Promise<Ticker>;
    /**
     * Get ticker at current moment
     * @param symbol
     * @description https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker
     */
    getTicker(symbol: string): Promise<Ticker>;
    /**
     * Return a few tickers an once
     * @param symbols
     * @param is24h get 24h ticker or current
     * @returns
     */
    getTickers(symbols: Array<string>, is24h?: boolean): Promise<Ticker[]>;
    /**
     * Get current average price
     * @param symbol
     * @description https://binance-docs.github.io/apidocs/spot/en/#current-average-price
     */
    getCurrentAvgPrice(symbol: string): Promise<any>;
    /**
     * Get order book
     * @param symbol
     * @description
     */
    getOrderBook(symbol: string): Promise<OrderBook>;
    /**
     * Account info and balances of assets
     * @description https://binance-docs.github.io/apidocs/spot/en/#account-information-user_data
     */
    accountInfo(): Promise<AccountInfo>;
    /**
     * Daily account balance snapshots
     * @param startTime unixtime
     * @param endTime unixtime
     * @description https://binance-docs.github.io/apidocs/spot/en/#daily-account-snapshot-user_data
     */
    dailyAccountSnapshot(startTime: number, endTime: number, type?: AccountBalanceType): Promise<DailyAccountSnapshot>;
    /**
     * Get account total in "displayCurrency" and assets balances
     * @param displayCurrency currency in which display total
     * @description [extra handler]
     */
    getAccountTotalAndBalances(displayCurrency?: string): Promise<[number, Balance[]]>;
    request(action: string, method?: Method, data?: null, options?: {}): Promise<any>;
}
