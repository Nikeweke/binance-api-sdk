export interface IKeys {
  apiKey: string
  secretKey: string
}

export type AccountBalanceType = 
  | "SPOT" 
  | "MARGIN" 
  | "FUTURES"

export class Asset {
  asset: string = '' // name 
  free: string = ''
  locked: string = ''
  savings: string = ''
}

// same that asset by have BTC fields 
export class Balance extends Asset {
  free_in_btc: string = ''
  locked_in_btc: string = ''
}

export interface AccountInfo {
  accountType: AccountBalanceType
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  updateTime: number
  balances: Array<Asset>
  permissions: Array<string>
  // here is not all fields are listed
}

export interface Ticker {
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


export interface Data {
  balances: Asset[]
  totalAssetOfBtc: string
}
export interface SnapshotVos {
  data: Data
  type: string
  updateTime: number
}
export interface DailyAccountSnapshot {
  code: number
  msg: string
  snapshotVos: SnapshotVos[]
}


export interface OrderBook {
  lastUpdateId: number
  bids: string[][]
  asks: string[][]
}

