"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_function_reflector_1 = __importDefault(require("js-function-reflector"));
const match = (value, pattern) => {
    const hasKey = (key) => String(value) === key;
    const matchingCase = Object.keys(pattern).find(hasKey);
    const defaultCase = '_';
    const hasDefault = pattern.hasOwnProperty(defaultCase);
    if (!matchingCase && !hasDefault) {
        throw new ReferenceError(`Match error for value: ${value}`);
    }
    return pattern[matchingCase || defaultCase];
};
const matchArray = (value, pattern) => {
    let params = [...value];
    const matchingCase = pattern.find(fn => {
        const args = js_function_reflector_1.default(fn).params;
        const hasSameLength = value.length === args.length;
        if (hasSameLength || args[0].name === '_') {
            params = args.map((item, index) => {
                const element = params[index];
                return element || item.value;
            });
            return true;
        }
        return false;
    });
    if (typeof matchingCase !== 'function') {
        throw new ReferenceError(`Match error for value: ${JSON.stringify(value)}`);
    }
    return matchingCase(...params);
};
exports.matchArray = matchArray;
const lazyMatch = (pattern) => (value) => match(value, pattern);
exports.lazyMatch = lazyMatch;
exports.default = match;
