"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const api_1 = __importDefault(require("./api"));
const init = (keys) => new api_1.default(keys);
exports.init = init;
// export default 
