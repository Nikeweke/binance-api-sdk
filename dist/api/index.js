"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
// extra handlers 
const get_account_total_and_balances_1 = __importDefault(require("./get-account-total-and-balances"));
class BinanceApi {
    constructor({ apiKey = '', secretKey = '' }) {
        this.api = 'https://api.binance.com';
        this.recvWindow = '7000';
        this.apiKey = apiKey;
        this.secretKey = secretKey;
    }
    /**
     * Get ticker for 24h change
     * @param pair
     * @description https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics
     */
    getTicker24h(symbol) {
        const config = {
            method: 'get',
            url: this.api + '/api/v3/ticker/24hr?symbol=' + symbol,
            headers: {}
        };
        return (0, axios_1.default)(config).then((r) => r.data);
    }
    /**
     * Get ticker at current moment
     * @param symbol
     * @description https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker
     */
    getTicker(symbol) {
        const config = {
            method: 'get',
            url: this.api + '/api/v3/ticker/price?symbol=' + symbol,
            headers: {}
        };
        return (0, axios_1.default)(config).then((r) => r.data);
    }
    /**
     * Return a few tickers an once
     * @param symbols
     * @param is24h get 24h ticker or current
     * @returns
     */
    getTickers(symbols, is24h = false) {
        const tickerFn = is24h ? 'getTicker24h' : 'getTicker';
        return Promise.all(symbols.map((pair) => this[tickerFn](pair)));
    }
    /**
     * Get current average price
     * @param symbol
     * @description https://binance-docs.github.io/apidocs/spot/en/#current-average-price
     */
    getCurrentAvgPrice(symbol) {
        const config = {
            method: 'get',
            url: this.api + '/api/v3/avgPrice?symbol=' + symbol,
            headers: {}
        };
        return (0, axios_1.default)(config).then((r) => r.data);
    }
    /**
     * Get order book
     * @param symbol
     * @description
     */
    getOrderBook(symbol) {
        const config = {
            method: 'get',
            url: this.api + '/api/v3/depth?symbol=' + symbol,
            headers: {}
        };
        return (0, axios_1.default)(config).then((r) => r.data);
    }
    // ======================================================> private 
    /**
     * Account info and balances of assets
     * @description https://binance-docs.github.io/apidocs/spot/en/#account-information-user_data
     */
    accountInfo() {
        const queryParams = (0, utils_1.toQueryParamsWithSignature)({
            recvWindow: this.recvWindow,
            timestamp: (0, utils_1.getTimestamp)(),
        }, this.secretKey);
        return this.request('/api/v3/account' + queryParams);
    }
    /**
     * Daily account balance snapshots
     * @param startTime unixtime
     * @param endTime unixtime
     * @description https://binance-docs.github.io/apidocs/spot/en/#daily-account-snapshot-user_data
     */
    dailyAccountSnapshot(startTime, endTime, type = 'SPOT') {
        const queryParams = (0, utils_1.toQueryParamsWithSignature)({
            type,
            recvWindow: this.recvWindow,
            startTime,
            endTime,
            timestamp: (0, utils_1.getTimestamp)(),
        }, this.secretKey);
        return this.request('/sapi/v1/accountSnapshot' + queryParams);
    }
    /**
     * Get account total in "displayCurrency" and assets balances
     * @param displayCurrency currency in which display total
     * @description [extra handler]
     */
    getAccountTotalAndBalances(displayCurrency = 'USDC') {
        return (0, get_account_total_and_balances_1.default)(this, displayCurrency);
    }
    request(action, method = 'get', data = null, options = {}) {
        const config = (Object.assign({ method, url: this.api + action, headers: {} }, options));
        if (this.apiKey) {
            config.headers['X-MBX-APIKEY'] = this.apiKey;
        }
        if (data) {
            config.data = JSON.stringify(data);
        }
        return axios_1.default.request(config).then((res) => res.data);
    }
}
exports.default = BinanceApi;
