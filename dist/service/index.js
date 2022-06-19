"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_account_total_and_balances_1 = __importDefault(require("./get-account-total-and-balances"));
class BinanceService {
    constructor(binanceApi) {
        this.binanceApi = binanceApi;
    }
    getAccountTotalAndBalances(displayCurrency = 'USDC') {
        return (0, get_account_total_and_balances_1.default)(this.binanceApi, displayCurrency);
    }
}
exports.default = BinanceService;
