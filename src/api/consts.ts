// enum TICKER_MAP {
//   UAH = 'BTCUAH',
//   EUR = 'BTCEUR',
//   USDC = 'BTCUSDC',
//   DAI = 'BTCDAI',
//   USDT = 'BTCUSDT',
//   BUSD = 'BTCBUSD',
//   RUB = 'BTCRUB',
//   GBP = 'BTCGBP',
//   AUD = 'BTCAUD',

//   BNB = 'BNBBTC',
//   ETH = 'ETHBTC'
// }


export const FIATS = <Array<string>>([
  'UAH',
  'EUR',
  'RUB',
])

export const STABLECOINS = <Array<string>>([
  'USDT',
  'USDC',
  'DAI',
  'BUSD',
])

export enum ASSET_TYPE {
  CRYPTO,
  STABLECOIN,
  FIAT
}

export enum DISPLAY_CURRENCIES {
  USDC = 'USDC',
  USDT = 'USDT',
  BUSD = 'BUSD',
  DAI = 'DAI',
}

export type ObjectAny = Record<string, any>
