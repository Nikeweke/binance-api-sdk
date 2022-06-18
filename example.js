// 1. init a keys
const keys = {
  publicKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  secretKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
}

// 2. get api or service
const { binanceApi, BinanceService } = require('./dist').default(keys)

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

BinanceService.getAccountTotalAndBalances(binanceApi)
