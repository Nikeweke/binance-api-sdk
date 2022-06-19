import { Balance } from "../interfaces"
import BinanceApi from "../api"
import getAccountTotalAndBalances from "./get-account-total-and-balances"


export default class BinanceService {
  binanceApi: BinanceApi

  constructor(binanceApi: BinanceApi) {
    this.binanceApi = binanceApi
  }

  getAccountTotalAndBalances(displayCurrency: string = 'USDC') : Promise<[number, Balance[]]> {
    return getAccountTotalAndBalances(this.binanceApi, displayCurrency)
  }
}