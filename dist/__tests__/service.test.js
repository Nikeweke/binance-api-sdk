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
const service_1 = __importDefault(require("../service"));
const KEYS = {
    apiKey: process.env.API_KEY || '',
    secretKey: process.env.SECRET_KEY || '',
};
describe('BinanceService:', () => {
    let binanceApi;
    let binanceService;
    beforeAll(() => {
        binanceApi = new api_1.default(KEYS);
        binanceService = new service_1.default(binanceApi);
    });
    test('Get account total and balances in USDC', () => __awaiter(void 0, void 0, void 0, function* () {
        const [total, balances] = yield binanceService
            .getAccountTotalAndBalances();
        expect(typeof total === 'number').toBe(true);
        expect(total > 0).toBe(true);
        expect(Object.keys(balances).length > 0).toBe(true);
    }));
});
