interface IKeys {
  apiKey: string
  secretKey: string
}

type AccountBalanceType = 
  | "SPOT" 
  | "MARGIN" 
  | "FUTURES"

class Asset {
  asset: string = '' // name 
  free: string = ''
  locked: string = ''
}

// same that asset by have BTC fields 
class Balance extends Asset {
  free_in_btc: string = ''
  locked_in_btc: string = ''
}

interface AccountInfo {
  accountType: AccountBalanceType
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  updateTime: number
  balances: Array<Asset>
  permissions: Array<string>
  // here is not all fields are listed
}

interface Ticker {
  symbol: string

  // ticker fields
  price: string 

  // 24h ticker fields
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number   // First tradeId
  lastId: number    // Last tradeId
  count: number        // Trade count
}

export {
  IKeys,

  AccountBalanceType,
  AccountInfo,
  Ticker,
  Balance,
}