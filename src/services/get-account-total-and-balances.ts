import BinanceApi from "../api"
import { Ticker, Balance } from "../interfaces"

enum TICKER_MAP {
  UAH = 'BTCUAH',
  EUR = 'BTCEUR',
  USDC = 'BTCUSDC',
  DAI = 'BTCDAI',
  USDT = 'BTCUSDT',
  BUSD = 'BTCBUSD',
  BNB = 'BNBBTC',
}

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
  const balances = <Record<string, any>>({})
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

  // calculate total balance in USDC
  // get tickers for all balances
  const tickers = await binanceApi
    .getTickers(Object.keys(balances))
    // transform array to object of { coin: price }
    .then((results: Ticker[]) => results.reduce((prev: Record<string, any>, curr: Ticker) => {
      const { symbol, price } = curr
      prev[symbol] = price  
      return prev
    }, {})) 

  const getAmountInBtc = (coin: string, amount: string) => {
    const rate = Number(tickers[TICKER_MAP[coin as keyof typeof TICKER_MAP]])
    const amountNumber = Number(amount)
    if (coin === 'BNB') {
      return amountNumber * rate
    } else {
      return amountNumber / rate 
    }
  }

  let totalInBtc = 0
  const amountFields = ['free', 'savings']
  for (const [coin, balance] of Object.entries(balances)) {
    for (const amountField of amountFields) {
      const btcFieldName = `${amountField}_in_btc` 

      balances[coin][btcFieldName] = 0
      
      if (Number(balance[amountField]) <= 0) {
        continue
      }

      const amountInBtc = getAmountInBtc(coin, balance[amountField])
      balances[coin][btcFieldName] = (amountInBtc).toFixed(8)
      totalInBtc += amountInBtc
    }
  }

  const totalInUsdc = tickers[TICKER_MAP.USDC] * totalInBtc
  return [totalInUsdc, balances as Array<Balance>]
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
