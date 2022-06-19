import { IKeys, Balance } from '../interfaces';
import BinanceApi from '../api'
import BinanceService from '../service'
 
const KEYS: IKeys = {
  apiKey: process.env.API_KEY || '',
  secretKey: process.env.SECRET_KEY || '',
}


describe('BinanceService:', () => {
  let binanceApi: BinanceApi
  let binanceService: BinanceService

  beforeAll(() => {
    binanceApi = new BinanceApi(KEYS)
    binanceService = new BinanceService(binanceApi)
  })

  test('Get account total and balances in USDC', async () => {
    const [ total, balances ] : [number, Balance[]] = await binanceService
      .getAccountTotalAndBalances()

    expect(typeof total === 'number').toBe(true);
    expect(total > 0).toBe(true)
    expect(Object.keys(balances).length > 0).toBe(true)
  });
});

