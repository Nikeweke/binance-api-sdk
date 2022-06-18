"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountBalances = void 0;
var TICKER_MAP;
(function (TICKER_MAP) {
    TICKER_MAP["UAH"] = "BTCUAH";
    TICKER_MAP["EUR"] = "BTCEUR";
    TICKER_MAP["USDC"] = "BTCUSDC";
    TICKER_MAP["DAI"] = "BTCDAI";
    TICKER_MAP["USDT"] = "BTCUSDT";
    TICKER_MAP["BUSD"] = "BTCBUSD";
    TICKER_MAP["BNB"] = "BNBBTC";
})(TICKER_MAP || (TICKER_MAP = {}));
/**
 * Get assets balance and total amount of assets pegged to USDC.
 * Supported currency: UAH, EUR, USDC, DAI, USDT, BUSD, BNB,
 * it means that if you will have some money in another currency it will be ignored or will brake
 *
 * The main idea is bring to a common denominator all assets,
 * in our case common denom. is BTC, and from BTC to USDC
 *
 * @param binanceApi instance of binance-api with keys
 * @returns current balances + in total in USDC on binance
 */
function getAccountBalances(binanceApi) {
    return __awaiter(this, void 0, void 0, function* () {
        // compose balances where free or locked is not empty
        const accountInfo = yield binanceApi.accountInfo();
        const balances = ({});
        for (const balance of accountInfo.balances) {
            if (!(Number(balance.free) > 0) && !(Number(balance.locked) > 0)) {
                continue;
            }
            const amount = balance.free;
            let coinName = balance.asset;
            let moneyType = 'free';
            const isSavings = coinName.slice(0, 2) === 'LD';
            // its saving
            if (isSavings) {
                coinName = coinName.slice(2, coinName.length);
                moneyType = 'savings';
            }
            if (balances[coinName] === undefined) {
                balances[coinName] = { free: 0, savings: 0 };
            }
            balances[coinName][moneyType] = amount;
        }
        // calculate total balance in USDC
        // get tickers for all balances
        const tickers = yield binanceApi
            .getTickers(Object.keys(balances))
            // transform array to object of { coin: price }
            .then((results) => results.reduce((prev, curr) => {
            const { symbol, price } = curr;
            prev[symbol] = price;
            return prev;
        }, {}));
        const getAmountInBtc = (coin, amount) => {
            const rate = Number(tickers[TICKER_MAP[coin]]);
            const amountNumber = Number(amount);
            if (coin === 'BNB') {
                return amountNumber * rate;
            }
            else {
                return amountNumber / rate;
            }
        };
        let totalInBtc = 0;
        const amountFields = ['free', 'savings'];
        for (const [coin, balance] of Object.entries(balances)) {
            for (const amountField of amountFields) {
                const btcFieldName = `${amountField}_in_btc`;
                balances[coin][btcFieldName] = 0;
                if (Number(balance[amountField]) <= 0) {
                    continue;
                }
                const amountInBtc = getAmountInBtc(coin, balance[amountField]);
                balances[coin][btcFieldName] = (amountInBtc).toFixed(8);
                totalInBtc += amountInBtc;
            }
        }
        const totalInUsdc = tickers[TICKER_MAP.USDC] * totalInBtc;
        return [totalInUsdc, balances];
    });
}
exports.getAccountBalances = getAccountBalances;
// [
//   { symbol: 'BNBBTC', price: '0.01001900' },      
//   { symbol: 'BTCUSDT', price: '29792.84000000' }, 
//   { symbol: 'BTCUSDC', price: '29767.21000000' }, 
//   { symbol: 'BTCBUSD', price: '29767.04000000' }, 
//   { symbol: 'BTCEUR', price: '27832.37000000' },  
//   { symbol: 'BTCUAH', price: '1042304.00000000' },
//   { symbol: 'BTCDAI', price: '29773.41000000' }   
// ]
// BTCUAH
// BTCEUR
// BTCUSDC 
// BTCDAI
// BTCUSDT
// BTCBUSD
// BNBBTC
// -------
// BTC/EUR
// BTC/UAH
// BTC/USDC
