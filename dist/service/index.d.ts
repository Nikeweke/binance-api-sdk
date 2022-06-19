import { Balance } from "../interfaces";
import BinanceApi from "../api";
export default class BinanceService {
    binanceApi: BinanceApi;
    constructor(binanceApi: BinanceApi);
    getAccountTotalAndBalances(displayCurrency?: string): Promise<[number, Balance[]]>;
}
