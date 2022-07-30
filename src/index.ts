import { IKeys } from "./interfaces";
import BinanceApi from "./api";

export * from './api/consts'
export default (keys: IKeys) => new BinanceApi(keys)