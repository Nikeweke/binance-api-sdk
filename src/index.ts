import BinanceApi from "./api";
import { IKeys } from "./interfaces";
import * as BinanceService from "./services";

// TODO: 
// create here binance-api and pass to binance-service must be a class
// and when you changing binance-api instance, it must be changing inside of binance-service

export default (keys: IKeys) => ({
  binanceApi: new BinanceApi(keys),
  BinanceService,
})