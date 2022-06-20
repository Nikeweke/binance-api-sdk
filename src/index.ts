import { IKeys } from "./interfaces";
import BinanceApi from "./api";

export const init = (keys: IKeys) => new BinanceApi(keys) 
