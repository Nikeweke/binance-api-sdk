import { IKeys } from "./interfaces";
import BinanceApi from "./api";

export default (keys: IKeys) => new BinanceApi(keys)