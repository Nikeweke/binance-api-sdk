# Binance API SDK


### Quick start
```js
// 1. init a keys
const keys = {
  apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  secretKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
}

// 2. get api and service
const binanceApi = require('binance-api-sdk').default(keys)

// 3. use 
binanceApi.getTicker('BTCEUR')
  .then((data) => console.log(data))
  .catch(err => console.log('Error: ', err.message))

binanceApi.getTicker24h('BTCUSDC')
  .then((data) => console.log(data))
  .catch(err => console.log('Error: ', err.message))

// set keys before use private functions
binanceApi.accountInfo()
  .then((data) => console.log(data))
  .catch(err => console.log('Error: ', err.message))

binanceApi.getAccountTotalAndBalances()
  .then((data) => console.log(data))
  .catch(err => console.log(err))
```

#### binanceApi.
* `.isKeysSet()` - check if keys are set (secret, api keys)
* `.getTicker('BTCEUR')` - last updates of market
* `.getTicker24h('BTCUSDC')` - last updates of market for 24h
* `.getTickers(['BTCUSDC', 'BTCEUR'])` - get a few tickers at once 
* `.getCurrentAvgPrice('BTCUSDC')` - get current average price 
* `.getOrderBook('BTCUSDC')` - order book for symbol
* `.accountInfo()` -  (private) account info and assets' balances
* `.dailyAccountSnapshot(startTime: number, endTime: number, type: AccountBalanceType = 'SPOT')` - (private) snapshot of your account balances (startTime, endTime - it is unixtime in milliseconds)
* `.getAccountTotalAndBalances(displayCurrency: string = 'USDC')` - Get total of your assets in *displayCurrency*
* `.request(action: string, method: Method = 'get', data = null, options = {})` -  make request to binance api

---
