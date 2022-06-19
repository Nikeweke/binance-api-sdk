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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("../api"));
const KEYS = {
    apiKey: process.env.API_KEY || '',
    secretKey: process.env.SECRET_KEY || '',
};
describe('BinanceAPI Public:', () => {
    let binanceApi;
    beforeAll(() => {
        binanceApi = new api_1.default(KEYS);
    });
    test('Get ticker', () => __awaiter(void 0, void 0, void 0, function* () {
        const symbol = 'BTCEUR';
        const data = yield binanceApi.getTicker(symbol);
        expect(data.symbol === symbol).toBe(true);
        expect(typeof data.price === 'string').toBe(true);
    }));
    test('Get ticker24h', () => __awaiter(void 0, void 0, void 0, function* () {
        const symbol = 'BTCEUR';
        const data = yield binanceApi.getTicker24h(symbol);
        expect(data.symbol === symbol).toBe(true);
        expect(Number(data.lastPrice) > 0).toBe(true);
    }));
    test('Get Order book', () => __awaiter(void 0, void 0, void 0, function* () {
        const symbol = 'BTCEUR';
        const data = yield binanceApi.getOrderBook(symbol);
        expect(typeof data.lastUpdateId === 'number').toBe(true);
        expect(data.bids.length > 0).toBe(true);
        expect(data.asks.length > 0).toBe(true);
    }));
});
describe('BinanceAPI Private:', () => {
    let binanceApi;
    beforeAll(() => {
        binanceApi = new api_1.default(KEYS);
    });
    test('Account info', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield binanceApi.accountInfo();
        expect(data.balances.length !== 0).toBe(true);
        expect(typeof data.updateTime === 'number').toBe(true);
    }));
    test('Daily account snapshot', () => __awaiter(void 0, void 0, void 0, function* () {
        const dayInMs = '86400000';
        const startTime = Date.now() - Number(dayInMs);
        const endTime = Date.now();
        const data = yield binanceApi.dailyAccountSnapshot(startTime, endTime);
        expect(data.snapshotVos[0].data.balances.length !== 0).toBe(true);
        expect(data.code === 200).toBe(true);
    }));
});
