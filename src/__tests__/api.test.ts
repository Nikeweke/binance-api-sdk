import { IKeys } from '../interfaces';
import BinanceApi from '../api'
 
const KEYS: IKeys = {
  apiKey: process.env.API_KEY || '',
  secretKey: process.env.SECRET_KEY || '',
}


describe('BinanceAPI Public:', () => {
  let binanceApi: BinanceApi

  beforeAll(() => {
    binanceApi = new BinanceApi(KEYS)
  })

  test('Get ticker', async () => {
    const symbol = 'BTCEUR'
    const data = await binanceApi.getTicker(symbol)

    expect(data.symbol === symbol).toBe(true);
    expect(typeof data.price === 'string').toBe(true);
  });

  test('Get ticker24h', async () => {
    const symbol = 'BTCEUR'
    const data = await binanceApi.getTicker24h(symbol)

    expect(data.symbol === symbol).toBe(true);
    expect(Number(data.lastPrice) > 0).toBe(true)
  });

  test('Get Order book', async () => {
    const symbol = 'BTCEUR'
    const data = await binanceApi.getOrderBook(symbol)

    expect(typeof data.lastUpdateId === 'number').toBe(true);
    expect(data.bids.length > 0).toBe(true)
    expect(data.asks.length > 0).toBe(true)
  });
});


describe('BinanceAPI Private:', () => {
  let binanceApi: BinanceApi

  beforeAll(() => {
    binanceApi = new BinanceApi(KEYS)
  })
  
  test('Account info', async () => {
    const data = await binanceApi.accountInfo()

    expect(data.balances.length !== 0).toBe(true);
    expect(typeof data.updateTime === 'number').toBe(true);
  });

  test('Daily account snapshot', async () => {
    const dayInMs = '86400000'
    const startTime = Date.now() - Number(dayInMs)
    const endTime = Date.now()
    const data = await binanceApi.dailyAccountSnapshot(startTime, endTime)

    expect(data.snapshotVos[0].data.balances.length !== 0).toBe(true);
    expect(data.code === 200).toBe(true);
  });


});
