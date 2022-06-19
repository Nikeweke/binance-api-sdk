"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./service/index"));
const api_1 = __importDefault(require("./api"));
// create here binance-api and pass to binance-service must be a class
// and when you changing binance-api instance, it must be changing inside of binance-service
exports.default = (keys) => {
    const binanceApi = new api_1.default(keys);
    return {
        binanceApi,
        binanceService: new index_1.default(binanceApi),
    };
};
