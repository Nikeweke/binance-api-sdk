"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISPLAY_CURRENCIES = exports.ASSET_TYPE = exports.STABLECOINS = exports.FIATS = void 0;
//   BNB = 'BNBBTC',
//   ETH = 'ETHBTC'
// }
exports.FIATS = ([
    'UAH',
    'EUR',
    'RUB',
]);
exports.STABLECOINS = ([
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
})(ASSET_TYPE = exports.ASSET_TYPE || (exports.ASSET_TYPE = {}));
var DISPLAY_CURRENCIES;
(function (DISPLAY_CURRENCIES) {
    DISPLAY_CURRENCIES["USDC"] = "USDC";
    DISPLAY_CURRENCIES["USDT"] = "USDT";
    DISPLAY_CURRENCIES["BUSD"] = "BUSD";
    DISPLAY_CURRENCIES["DAI"] = "DAI";
})(DISPLAY_CURRENCIES = exports.DISPLAY_CURRENCIES || (exports.DISPLAY_CURRENCIES = {}));
