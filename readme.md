# Binance API SDK


### Quick start
```js
// 1. init a keys
const keys = {
  apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  secretKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
}

// 2. get api and service
const { binanceApi, binanceService } = require('./dist').default(keys)

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

binanceService.getAccountTotalAndBalances(binanceApi)
  .then((data) => console.log(data))
  .catch(err => console.log(err))
```

#### binanceApi.
* `.getTicker('BTCEUR')` - last updates of market
* `.getTicker24h('BTCUSDC')` - last updates of market for 24h
* `.getTickers(['BTCUSDC', 'BTCEUR'])` - get a few tickers at once 
* `.getCurrentAvgPrice('BTCUSDC')` - get current average price 
* `.getOrderBook('BTCUSDC')` - order book for symbol
* `.accountInfo()` -  (private) account info and assets' balances
* `.dailyAccountSnapshot(startTime: number, endTime: number, type: AccountBalanceType = 'SPOT')` - (private) snapshot of your account balances (startTime, endTime - it is unixtime in milliseconds)
* `.request(action: string, method: Method = 'get', data = null, options = {})` -  make request to binance api

#### binanceService.
* `.getAccountTotalAndBalances(displayCurrency: string = 'USDC')` - Get total of your assets in *displayCurrency*

---

### Check out my `@binance_ticker_bot` on telegram 🤖

#### [Link](https://t.me/binance_ticker_bot)

#### Features
* Get balance with currency rates
* Get balance with details by each asset
* Get balance as image 
* Get currency rates
* Get chart for during week for currencies
* Subscribe/unsubscribe on scheduled price updates
* Add apiKey and secretKey

