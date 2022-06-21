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
// enum TICKER_MAP {
//   UAH = 'BTCUAH',
//   EUR = 'BTCEUR',
//   USDC = 'BTCUSDC',
//   DAI = 'BTCDAI',
//   USDT = 'BTCUSDT',
//   BUSD = 'BTCBUSD',
//   RUB = 'BTCRUB',
//   GBP = 'BTCGBP',
//   AUD = 'BTCAUD',
//   BNB = 'BNBBTC',
//   ETH = 'ETHBTC'
// }
const FIATS = ([
    'UAH',
    'EUR',
    'RUB',
]);
const STABLECOINS = ([
    'USDT',
    'USDC',
    'DAI',
    'BUSD',
]);
var ASSET_TYPE;
(function (ASSET_TYPE) {
    ASSET_TYPE[ASSET_TYPE["CRYPTO"] = 0] = "CRYPTO";
    ASSET_TYPE[ASSET_TYPE["STABLECOIN"] = 1] = "STABLECOIN";
    ASSET_TYPE[ASSET_TYPE["FIAT"] = 2] = "FIAT";
})(ASSET_TYPE || (ASSET_TYPE = {}));
// if it is fiat or stablecoin then - BTC / [fiat|stablecoin]
// if crypto - [crypto] / BTC
// holds reverse map of values { assetName(DAI, USDC, ...): tickerSymbol(BTCUAH, BTCUSDC, BNBBTC)}
let TICKER_MAP = {};
let TICKER_SYMBOLS = [];
const GENERAL_CURRENCY = 'BTC';
let DISPLAY_CURRENCY = '';
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
function getAccountTotalAndBalances(binanceApi, displayCurrency = 'USDC') {
    return __awaiter(this, void 0, void 0, function* () {
        DISPLAY_CURRENCY = displayCurrency;
        try {
            // compose balances where free or locked is not empty
            const accountInfo = yield binanceApi.accountInfo();
            const balances = composeBalances(accountInfo);
            fillTickerMapAndSymbols(balances);
            const tickers = yield getTickersForBalances(binanceApi);
            const totalInBtc = getTotalInBtc(balances, tickers);
            const totalInCurrency = getTotalInGivenCurrency(tickers, totalInBtc, DISPLAY_CURRENCY);
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
function fillTickerMapAndSymbols(balances) {
    // loop over asset names
    for (const assetName of Object.keys(balances)) {
        if (assetName === GENERAL_CURRENCY) {
            continue;
        }
        let assetType = getAssetTypeByName(assetName);
        let isFiatOrStablecoin = assetType === ASSET_TYPE.FIAT ||
            assetType === ASSET_TYPE.STABLECOIN;
        let symbol = isFiatOrStablecoin
            ? GENERAL_CURRENCY + assetName
            : assetName + GENERAL_CURRENCY;
        TICKER_SYMBOLS.push(symbol);
        TICKER_MAP[assetName] = symbol;
        TICKER_MAP[symbol] = assetName;
    }
}
function getAssetTypeByName(assetName) {
    if (FIATS.includes(assetName)) {
        return ASSET_TYPE.FIAT;
    }
    else if (STABLECOINS.includes(assetName)) {
        return ASSET_TYPE.STABLECOIN;
    }
    else {
        return ASSET_TYPE.CRYPTO;
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
                if (assetType === ASSET_TYPE.FIAT || assetType === ASSET_TYPE.STABLECOIN) {
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
function getTotalInGivenCurrency(tickers, totalInBtc, currencyName) {
    return tickers[TICKER_MAP[currencyName]] * totalInBtc;
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
