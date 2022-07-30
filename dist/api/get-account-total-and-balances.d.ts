import BinanceApi from ".";
import { Balance } from "../interfaces";
import { DISPLAY_CURRENCIES } from './consts';
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
export default function getAccountTotalAndBalances(binanceApi: BinanceApi, displayCurrency: DISPLAY_CURRENCIES): Promise<[number, Balance[]]>;
