"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimestamp = exports.getSignature = exports.toQueryParamsWithSignature = exports.toQueryParams = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Get object and make it to query-params string
 * @param obj
 * @returns string - like key=val&ke2=val2
 */
function toQueryParams(obj) {
    const str = Array();
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" +
                encodeURIComponent(obj[p]));
        }
    return str.join("&");
}
exports.toQueryParams = toQueryParams;
function toQueryParamsWithSignature(queryParams, secretKey) {
    let queryParamsStr = toQueryParams(queryParams);
    return '?' + queryParamsStr +
        '&signature=' + getSignature(queryParamsStr, secretKey);
}
exports.toQueryParamsWithSignature = toQueryParamsWithSignature;
function getTimestamp() {
    return Date.now();
}
exports.getTimestamp = getTimestamp;
function getSignature(params, secretKey) {
    return crypto_1.default
        .createHmac('sha256', secretKey)
        .update(params)
        .digest('hex');
}
exports.getSignature = getSignature;
