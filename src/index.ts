import BinanceApi from "./api";
import { IKeys } from "./interfaces";
import * as BinanceService from "./services";


export default (keys: IKeys) => ({
  binanceApi: new BinanceApi(keys),
  BinanceService,
})