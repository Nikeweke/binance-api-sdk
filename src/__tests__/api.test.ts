import { IKeys } from '../interfaces';
import BinanceApi from '../api'
 
const KEYS: IKeys = {
  apiKey: process.env.KUNA_PUBLIC_KEY || '',
  secretKey: process.env.KUNA_SECRET_KEY || '',
}


describe('BinanceAPI public:', () => {
  
  test('Get ticker', async () => {
    const api = new BinanceApi(KEYS)
    const symbol = 'BTCEUR'
    const data = await api.getTicker(symbol)

    expect(data.symbol === symbol).toBe(true);
    expect(typeof data.price === 'string').toBe(true);
  });

  test('Get ticker24h', async () => {
    const api = new BinanceApi(KEYS)
    const symbol = 'BTCEUR'
    const data = await api.getTicker24h(symbol)

    expect(data.symbol === symbol).toBe(true);
    expect(Number(data.lastPrice) > 0).toBe(true)
  });

  // test('Get account info', async () => {
  //   const api = new BinanceApi(KEYS)
  //   const data = await api.accountInfo()

  //   expect(data.balances.length !== 0).toBe(true);
  //   expect(typeof data.updateTime === 'number').toBe(true);
  // });

  

});


describe('BinanceAPI public:', () => {
  // test('Get account info', async () => {
  //   const api = new BinanceApi(KEYS)
  //   const data = await api.accountInfo()

  //   expect(data.balances.length !== 0).toBe(true);
  //   expect(typeof data.updateTime === 'number').toBe(true);
  // });


});
