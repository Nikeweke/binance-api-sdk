"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Balance = exports.Asset = void 0;
class Asset {
    constructor() {
        this.asset = ''; // name 
        this.free = '';
        this.locked = '';
        this.savings = '';
    }
}
exports.Asset = Asset;
// same that asset by have BTC fields 
class Balance extends Asset {
    constructor() {
        super(...arguments);
        this.free_in_btc = '';
        this.locked_in_btc = '';
    }
}
exports.Balance = Balance;
