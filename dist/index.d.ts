import { IKeys } from "./interfaces";
import BinanceService from "./service/index";
import BinanceApi from "./api";
declare const _default: (keys: IKeys) => {
    binanceApi: BinanceApi;
    binanceService: BinanceService;
};
export default _default;
