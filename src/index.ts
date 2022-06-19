import { IKeys } from "./interfaces";
import BinanceService from "./service/index";
import BinanceApi from "./api";

// create here binance-api and pass to binance-service must be a class
// and when you changing binance-api instance, it must be changing inside of binance-service
export default (keys: IKeys) => {
  const binanceApi = new BinanceApi(keys) 
  return {
    binanceApi,
    binanceService: new BinanceService(binanceApi),
  }
}