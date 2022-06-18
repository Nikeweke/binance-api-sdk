import BinanceApi from "./api";
import { IKeys } from "./interfaces";
import * as BinanceService from "./service";
declare const _default: (keys: IKeys) => {
    binanceApi: BinanceApi;
    BinanceService: typeof BinanceService;
};
export default _default;
