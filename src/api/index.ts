import axios, { Method, AxiosRequestConfig, AxiosResponse } from 'axios'

import { getTimestamp, toQueryParamsWithSignature } from '../utils'
import { 
  IKeys, AccountBalanceType, AccountInfo, 
  Ticker, DailyAccountSnapshot, OrderBook, Balance
} from '../interfaces'

// extra handlers 
import getAccountTotalAndBalances from './get-account-total-and-balances'


export default class BinanceApi {
  private api: string = 'https://api.binance.com'
  public apiKey: string
  public secretKey: string
  public recvWindow: string = '7000'

  constructor({ apiKey = '', secretKey = '' }: IKeys) {
    this.apiKey = apiKey
    this.secretKey = secretKey
  }

  /**
   * Check if keys are set
   */
  isKeysSet() : boolean {
    return this.apiKey.length > 0 && this.secretKey.length > 0 
  }

  /**
   * Get ticker for 24h change
   * @param pair 
   * @description https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics
   */
  getTicker24h(symbol: string) : Promise<Ticker> {
    const config = {
      method: 'get',
      url: this.api + '/api/v3/ticker/24hr?symbol=' + symbol,
      headers: { }
    };
    return axios(config).then((r) => r.data)
  } 

  /**
   * Get ticker at current moment
   * @param symbol 
   * @description https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker
   */
  getTicker(symbol: string) : Promise<Ticker> {
    const config = {
      method: 'get',
      url: this.api + '/api/v3/ticker/price?symbol=' + symbol,
      headers: { }
    };
    return axios(config).then((r) => r.data)
  } 
    
  /**
   * Return a few tickers an once 
   * @param symbols 
   * @param is24h get 24h ticker or current
   * @returns 
   */
  getTickers(symbols: Array<string>, is24h: boolean = false) : Promise<Ticker[]> {
    const tickerFn = is24h ? 'getTicker24h' : 'getTicker'
    return Promise.all(
      symbols.map((pair) => this[tickerFn](pair))
    )
  }

  /**
   * Get current average price
   * @param symbol 
   * @description https://binance-docs.github.io/apidocs/spot/en/#current-average-price
   */
  getCurrentAvgPrice(symbol: string) : Promise<any> {
    const config = {
      method: 'get',
      url: this.api + '/api/v3/avgPrice?symbol=' + symbol,
      headers: { }
    };
    return axios(config).then((r) => r.data)
  } 

  /**
   * Get order book
   * @param symbol 
   * @description
   */
  getOrderBook(symbol: string) : Promise<OrderBook> {
    const config = {
      method: 'get',
      url: this.api + '/api/v3/depth?symbol=' + symbol,
      headers: { }
    };
    return axios(config).then((r) => r.data)
  } 


  // ======================================================> private 
  /**
   * Account info and balances of assets 
   * @description https://binance-docs.github.io/apidocs/spot/en/#account-information-user_data
   */
  accountInfo() : Promise<AccountInfo> {
    const queryParams = toQueryParamsWithSignature({
      recvWindow: this.recvWindow,
      timestamp: getTimestamp(),
    }, this.secretKey)
    return this.request('/api/v3/account' + queryParams)
  }

  /**
   * Daily account balance snapshots 
   * @param startTime unixtime
   * @param endTime unixtime
   * @description https://binance-docs.github.io/apidocs/spot/en/#daily-account-snapshot-user_data
   */
  dailyAccountSnapshot(startTime: number, endTime: number, type: AccountBalanceType = 'SPOT') : Promise<DailyAccountSnapshot> {
    const queryParams = toQueryParamsWithSignature({
      type,
      recvWindow: this.recvWindow,
      startTime,
      endTime,
      timestamp: getTimestamp(),
    }, this.secretKey)
    return this.request('/sapi/v1/accountSnapshot' + queryParams)
  }

  /**
   * Get account total in "displayCurrency" and assets balances 
   * @param displayCurrency currency in which display total
   * @description [extra handler]
   */
  getAccountTotalAndBalances(displayCurrency: string = 'USDC') : Promise<[number, Balance[]]> {
    return getAccountTotalAndBalances(this, displayCurrency)
  }

  request(action: string, method: Method = 'get', data = null, options = {}) : Promise<any> {
    const config = <AxiosRequestConfig>({
      method,
      url: this.api + action,
      headers: {},
      ...options,
    });

    if (this.apiKey) {
      config.headers!['X-MBX-APIKEY'] = this.apiKey
    }
    if (data) {
      config.data = JSON.stringify(data)
    }

    return axios.request(config).then((res: AxiosResponse) => res.data)
  }
}




