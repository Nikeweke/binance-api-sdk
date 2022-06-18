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
    apiKey: process.env.KUNA_PUBLIC_KEY || '',
    secretKey: process.env.KUNA_SECRET_KEY || '',
};
describe('BinanceAPI public:', () => {
    test('Get ticker', () => __awaiter(void 0, void 0, void 0, function* () {
        const api = new api_1.default(KEYS);
        const symbol = 'BTCEUR';
        const data = yield api.getTicker(symbol);
        expect(data.symbol === symbol).toBe(true);
        expect(typeof data.price === 'string').toBe(true);
    }));
    test('Get ticker24h', () => __awaiter(void 0, void 0, void 0, function* () {
        const api = new api_1.default(KEYS);
        const symbol = 'BTCEUR';
        const data = yield api.getTicker24h(symbol);
        expect(data.symbol === symbol).toBe(true);
        expect(Number(data.lastPrice) > 0).toBe(true);
    }));
    // test('Get account info', async () => {
    //   const api = new BinanceApi(KEYS)
    //   const data = await api.accountInfo()
    //   expect(data.balances.length !== 0).toBe(true);
    //   expect(typeof data.updateTime === 'number').toBe(true);
    // });
});
describe('BinanceAPI private:', () => {
    // test('Get account info', async () => {
    //   const api = new BinanceApi(KEYS)
    //   const data = await api.accountInfo()
    //   expect(data.balances.length !== 0).toBe(true);
    //   expect(typeof data.updateTime === 'number').toBe(true);
    // });
});
