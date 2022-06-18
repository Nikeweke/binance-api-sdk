import BinanceApi from "../api"
import { Ticker, Balance, AccountInfo } from "../interfaces"

enum TICKER_MAP {
  UAH = 'BTCUAH',
  EUR = 'BTCEUR',
  USDC = 'BTCUSDC',
  DAI = 'BTCDAI',
  USDT = 'BTCUSDT',
  BUSD = 'BTCBUSD',
  RUB = 'BTCRUB',
  GBP = 'BTCGBP',
  AUD = 'BTCAUD',

  BNB = 'BNBBTC',
  ETH = 'ETHBTC'
}


const FIATS = <Array<string>>([
  'UAH',
  'EUR',
  'RUB',
])

const STABLECOINS = <Array<string>>([
  'USDT',
  'USDC',
  'DAI',
  'BUSD',
])

enum ASSET_TYPE {
  CRYPTO,
  STABLECOIN,
  FIAT
}

type ObjectAny = Record<string, any>

// if it is fiat or stablecoin then - BTC / [fiat|stablecoin]
// if crypto - [crypto] / BTC

/**
 * Get assets balance and total amount of assets pegged to USDC.
 * Supported currency: UAH, EUR, USDC, DAI, USDT, BUSD, BNB, 
 * it means that if you will have some money in another currency it will be ignored or will brake
 * 
 * The main idea is bring to a common denominator all assets, 
 * in our case common denom. is BTC, and from BTC to USDC
 *  
 * @param binanceApi instance of binance-api with keys
 * @returns current balances + in total in USDC on binance
 */
export default async function getAccountTotalAndBalances(binanceApi: BinanceApi) : Promise<[number, Balance[]]> {
  // compose balances where free or locked is not empty
  const accountInfo = await binanceApi.accountInfo()
  const balances = composeBalances(accountInfo)
  const tickers = getTickersForBalances(binanceApi, balances)
  const totalInBtc = getTotalInBtc(balances, tickers)
  const totalInCurrency = getTotalInGivenCurrency(tickers, totalInBtc, TICKER_MAP.USDC)
  return [totalInCurrency, balances as Array<Balance>]
}

function composeBalances(accountInfo: AccountInfo) : ObjectAny {
  const balances = <ObjectAny>({})
  for (const balance of accountInfo.balances) {
    if (!(Number(balance.free) > 0) && !(Number(balance.locked) > 0)) {
      continue
    }

    const amount = balance.free
    let coinName = balance.asset
    let moneyType = 'free'
    const isSavings = coinName.slice(0, 2) === 'LD'

    // its saving
    if (isSavings) {
      coinName = coinName.slice(2, coinName.length)
      moneyType = 'savings'
    }

    if (balances[coinName] === undefined) {
      balances[coinName] = { free: 0, savings: 0 }
    }

    balances[coinName][moneyType] = amount
  }
  return balances
}

function getTickersForBalances(binanceApi: BinanceApi, balances: ObjectAny) : ObjectAny {
  return binanceApi
    .getTickers(Object.keys(balances))
    // transform array to object of { coin: price }
    .then((results: Ticker[]) => 
      results.reduce(
        (prev: ObjectAny, curr: Ticker) => {
          const { symbol, price } = curr
          prev[symbol] = price  
          return prev
        }, {})
    ) 
}

function getTotalInBtc(balances: ObjectAny, tickers: ObjectAny) : number {
  let totalInBtc = 0
  const amountFields = ['free', 'savings']
  for (const [coin, balance] of Object.entries(balances)) {
    // let isFiat, isStablecoin, isCrypto = false
    let assetType: ASSET_TYPE

    if (FIATS.includes(coin)) {
      assetType = ASSET_TYPE.FIAT
    } else if (STABLECOINS.includes(coin)) {
      assetType = ASSET_TYPE.STABLECOIN
    } else {
      assetType = ASSET_TYPE.CRYPTO
    }

    for (const amountField of amountFields) {
      const btcFieldName = `${amountField}_in_btc` 
      balances[coin][btcFieldName] = 0
      
      if (Number(balance[amountField]) <= 0) {
        continue
      }

      const rate = Number(tickers[TICKER_MAP[coin as keyof typeof TICKER_MAP]])
      const amount = Number(balance[amountField])
      let amountInBtc = 0
      if (assetType === ASSET_TYPE.FIAT || assetType === ASSET_TYPE.STABLECOIN) {
        amountInBtc = amount / rate
      } else {
        amountInBtc = amount * rate
      }

      balances[coin][btcFieldName] = (amountInBtc).toFixed(8)
      totalInBtc += amountInBtc
    }

  }
  return totalInBtc
}

function getTotalInGivenCurrency(tickers: ObjectAny, totalInBtc: number, currencyName: TICKER_MAP = TICKER_MAP.USDC) : number {
  return tickers[currencyName] * totalInBtc
}

// [
//   { symbol: 'BNBBTC', price: '0.01001900' },      
//   { symbol: 'BTCUSDT', price: '29792.84000000' }, 
//   { symbol: 'BTCUSDC', price: '29767.21000000' }, 
//   { symbol: 'BTCBUSD', price: '29767.04000000' }, 
//   { symbol: 'BTCEUR', price: '27832.37000000' },  
//   { symbol: 'BTCUAH', price: '1042304.00000000' },
//   { symbol: 'BTCDAI', price: '29773.41000000' }   
// ]

// BTCUAH
// BTCEUR
// BTCUSDC 
// BTCDAI
// BTCUSDT
// BTCBUSD
// BNBBTC

// -------
// BTC/EUR
// BTC/UAH
// BTC/USDC
