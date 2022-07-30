import BinanceApi from "."
import { Ticker, Balance, AccountInfo } from "../interfaces"
import {
  FIATS,
  STABLECOINS,
  ASSET_TYPE,
  DISPLAY_CURRENCIES,
  ObjectAny,
} from './consts'

// if it is fiat or stablecoin then - BTC / [fiat|stablecoin]
// if crypto - [crypto] / BTC

// holds reverse map of values { assetName(DAI, USDC, ...): tickerSymbol(BTCUAH, BTCUSDC, BNBBTC)}
let TICKER_MAP: Record<string, string> = {}
let TICKER_SYMBOLS: Array<string> = []

const GENERAL_CURRENCY = 'BTC'

/**
 * Get assets balance and total amount of assets pegged to USDC.
 * Supported currency: UAH, EUR, USDC, DAI, USDT, BUSD, BNB, 
 * it means that if you will have some money in another currency it will be ignored or will brake
 * 
 * The main idea is bring to a common denominator all assets, 
 * in our case common denom. is BTC, and from BTC to USDC
 *  
 * @returns current balances + in total in USDC on binance
 */
export default async function getAccountTotalAndBalances(binanceApi: BinanceApi, displayCurrency: DISPLAY_CURRENCIES) : Promise<[number, Balance[]]> {
  try {
    // compose balances where free or locked is not empty
    const accountInfo = await binanceApi.accountInfo()
    const balances = composeBalances(accountInfo)
    fillTickerMapAndSymbols(balances, displayCurrency)
    const tickers = await getTickersForBalances(binanceApi)
    const totalInBtc = getTotalInBtc(balances, tickers)
    const totalInCurrency = getTotalInGivenCurrency(tickers, totalInBtc, displayCurrency)
    return [totalInCurrency, balances as Array<Balance>]
 
  } catch(err) {
    console.log(err)
    return [0, Array<Balance>()]
  
  // clear dual map
  } finally {
    TICKER_MAP = {}
    TICKER_SYMBOLS = []
  }

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

function fillTickerMapAndSymbols(balances: ObjectAny, displayCurrency: DISPLAY_CURRENCIES) {
  // loop over asset names
  let keys = Object.keys(balances)
  keys.push(displayCurrency)
  keys = [...new Set(keys)]; // removing the duplicates

  for (const assetName of Object.keys(balances)) {
    if (assetName === GENERAL_CURRENCY) {
      continue
    }

    let assetType: ASSET_TYPE = getAssetTypeByName(assetName)
    let isFiatOrStablecoin = assetType === ASSET_TYPE.FIAT || 
      assetType === ASSET_TYPE.STABLECOIN

    let symbol = isFiatOrStablecoin 
      ? GENERAL_CURRENCY + assetName
      : assetName + GENERAL_CURRENCY

    TICKER_SYMBOLS.push(symbol)
    TICKER_MAP[assetName] = symbol
    TICKER_MAP[symbol] = assetName
  }
}

function getAssetTypeByName(assetName: string) : ASSET_TYPE {
  if (FIATS.includes(assetName)) {
    return ASSET_TYPE.FIAT
  } else if (STABLECOINS.includes(assetName)) {
    return ASSET_TYPE.STABLECOIN
  } else {
    return ASSET_TYPE.CRYPTO
  }
} 

function getTickersForBalances(binanceApi: BinanceApi) : Promise<ObjectAny> {
  return binanceApi
    .getTickers(TICKER_SYMBOLS)
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
  for (const [assetName, balance] of Object.entries(balances)) {
    // let isFiat, isStablecoin, isCrypto = false
    let assetType: ASSET_TYPE = getAssetTypeByName(assetName)

    for (const amountField of amountFields) {
      const btcFieldName = `${amountField}_in_btc` 
      balances[assetName][btcFieldName] = 0
      
      if (Number(balance[amountField]) <= 0) {
        continue
      }
      
      let amountInBtc = 0
      const amount = Number(balance[amountField])
      if (assetName === GENERAL_CURRENCY) {
        amountInBtc = amount
      } else {
        const rate = Number(tickers[TICKER_MAP[assetName as keyof typeof TICKER_MAP]])
        if (assetType === ASSET_TYPE.FIAT || assetType === ASSET_TYPE.STABLECOIN) {
          amountInBtc = amount / rate
        } else {
          amountInBtc = amount * rate
        }
      }

      balances[assetName][btcFieldName] = (amountInBtc).toFixed(8)
      totalInBtc += amountInBtc
    }

  }
  return totalInBtc
}

function getTotalInGivenCurrency(tickers: ObjectAny, totalInBtc: number, displayCurrency: DISPLAY_CURRENCIES) : number {
  return tickers[TICKER_MAP[displayCurrency]] * totalInBtc
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
