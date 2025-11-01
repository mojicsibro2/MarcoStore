"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopement = isDevelopement;
exports.isProduction = isProduction;
function isDevelopement() {
    return process.env.NODE_ENV?.startsWith('dev') ? true : false;
}
function isProduction() {
    return process.env.NODE_ENV?.startsWith('prod') ? true : false;
}
//# sourceMappingURL=helper.util.js.map