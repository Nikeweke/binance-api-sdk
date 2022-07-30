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
const consts_1 = require("./consts");
// if it is fiat or stablecoin then - BTC / [fiat|stablecoin]
// if crypto - [crypto] / BTC
// holds reverse map of values { assetName(DAI, USDC, ...): tickerSymbol(BTCUAH, BTCUSDC, BNBBTC)}
let TICKER_MAP = {};
let TICKER_SYMBOLS = [];
const GENERAL_CURRENCY = 'BTC';
/**
 * Get assets balance and total amount of assets pegged to USDC.
 * Supported currency: UAH, EUR, USDC, DAI, USDT, BUSD, BNB,
 * it means that if you will have some money in another currency it will be ignored or will brake
 *
 * The main idea is bring to a common denominator all assets,
 * in our case common denom. is BTC, and from BTC to USDC
 *
 * @returns current balances + in total in USDC on binance
 */
function getAccountTotalAndBalances(binanceApi, displayCurrency) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // compose balances where free or locked is not empty
            const accountInfo = yield binanceApi.accountInfo();
            const balances = composeBalances(accountInfo);
            fillTickerMapAndSymbols(balances, displayCurrency);
            const tickers = yield getTickersForBalances(binanceApi);
            const totalInBtc = getTotalInBtc(balances, tickers);
            const totalInCurrency = getTotalInGivenCurrency(tickers, totalInBtc, displayCurrency);
            return [totalInCurrency, balances];
        }
        catch (err) {
            console.log(err);
            return [0, Array()];
            // clear dual map
        }
        finally {
            TICKER_MAP = {};
            TICKER_SYMBOLS = [];
        }
    });
}
exports.default = getAccountTotalAndBalances;
function composeBalances(accountInfo) {
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
    return balances;
}
function fillTickerMapAndSymbols(balances, displayCurrency) {
    // loop over asset names
    let keys = Object.keys(balances);
    keys.push(displayCurrency);
    keys = [...new Set(keys)]; // removing the duplicates
    for (const assetName of Object.keys(balances)) {
        if (assetName === GENERAL_CURRENCY) {
            continue;
        }
        let assetType = getAssetTypeByName(assetName);
        let isFiatOrStablecoin = assetType === consts_1.ASSET_TYPE.FIAT ||
            assetType === consts_1.ASSET_TYPE.STABLECOIN;
        let symbol = isFiatOrStablecoin
            ? GENERAL_CURRENCY + assetName
            : assetName + GENERAL_CURRENCY;
        TICKER_SYMBOLS.push(symbol);
        TICKER_MAP[assetName] = symbol;
        TICKER_MAP[symbol] = assetName;
    }
}
function getAssetTypeByName(assetName) {
    if (consts_1.FIATS.includes(assetName)) {
        return consts_1.ASSET_TYPE.FIAT;
    }
    else if (consts_1.STABLECOINS.includes(assetName)) {
        return consts_1.ASSET_TYPE.STABLECOIN;
    }
    else {
        return consts_1.ASSET_TYPE.CRYPTO;
    }
}
function getTickersForBalances(binanceApi) {
    return binanceApi
        .getTickers(TICKER_SYMBOLS)
        // transform array to object of { coin: price }
        .then((results) => results.reduce((prev, curr) => {
        const { symbol, price } = curr;
        prev[symbol] = price;
        return prev;
    }, {}));
}
function getTotalInBtc(balances, tickers) {
    let totalInBtc = 0;
    const amountFields = ['free', 'savings'];
    for (const [assetName, balance] of Object.entries(balances)) {
        // let isFiat, isStablecoin, isCrypto = false
        let assetType = getAssetTypeByName(assetName);
        for (const amountField of amountFields) {
            const btcFieldName = `${amountField}_in_btc`;
            balances[assetName][btcFieldName] = 0;
            if (Number(balance[amountField]) <= 0) {
                continue;
            }
            let amountInBtc = 0;
            const amount = Number(balance[amountField]);
            if (assetName === GENERAL_CURRENCY) {
                amountInBtc = amount;
            }
            else {
                const rate = Number(tickers[TICKER_MAP[assetName]]);
                if (assetType === consts_1.ASSET_TYPE.FIAT || assetType === consts_1.ASSET_TYPE.STABLECOIN) {
                    amountInBtc = amount / rate;
                }
                else {
                    amountInBtc = amount * rate;
                }
            }
            balances[assetName][btcFieldName] = (amountInBtc).toFixed(8);
            totalInBtc += amountInBtc;
        }
    }
    return totalInBtc;
}
function getTotalInGivenCurrency(tickers, totalInBtc, displayCurrency) {
    return tickers[TICKER_MAP[displayCurrency]] * totalInBtc;
}
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
