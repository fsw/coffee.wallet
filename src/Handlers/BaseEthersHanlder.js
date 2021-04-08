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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var BaseCoinHandler_1 = require("./BaseCoinHandler");
var BigNum_1 = require("../BigNum");
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var config = require('../../config');
var EthTransaction = (function () {
    function EthTransaction(handler, data, signed) {
        this.data = data;
        this.handler = handler;
        this.signed = signed;
    }
    EthTransaction.prototype.getBalanceAfter = function () {
        return "";
    };
    EthTransaction.prototype.getFeeDisplay = function () {
        return "TODO";
    };
    EthTransaction.prototype.getFeeETA = function () {
        return "TODO";
    };
    EthTransaction.prototype.getSummaryTable = function () {
        return "TODO";
    };
    EthTransaction.prototype.send = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.handler.getProvider().sendTransaction(this.signed)];
                    case 1:
                        response = _a.sent();
                        return [2, response.hash];
                }
            });
        });
    };
    return EthTransaction;
}());
var BaseEthersHanlder = (function () {
    function BaseEthersHanlder() {
        this.networkName = 'ropsten';
    }
    BaseEthersHanlder.prototype.getProvider = function () {
        return new ethers_1.ethers.providers.InfuraProvider(this.networkName, config.infuraKey);
    };
    BaseEthersHanlder.prototype.getBalance = function (addr) {
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getProvider().getBalance(addr)];
                    case 1:
                        ret = _a.sent();
                        return [2, new BaseCoinHandler_1.Balance(new BigNum_1.BigNum(ret.toString()), new BigNum_1.BigNum("0"))];
                }
            });
        });
    };
    BaseEthersHanlder.prototype.getOwnBalance = function (keychain) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getBalance(this.getReceiveAddr(keychain))];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BaseEthersHanlder.prototype.getDecimals = function (keychain) {
        return 0;
    };
    BaseEthersHanlder.prototype.getDescription = function () {
        return "";
    };
    BaseEthersHanlder.prototype.getFeeOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gasPrice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getProvider().getGasPrice()];
                    case 1:
                        gasPrice = _a.sent();
                        return [2, [
                                gasPrice.toNumber()
                            ]];
                }
            });
        });
    };
    BaseEthersHanlder.prototype.getIcon = function () {
        return "";
    };
    BaseEthersHanlder.prototype.getIdenticonSeed = function (addr) {
        return 0;
    };
    BaseEthersHanlder.prototype.getLinks = function () {
        return {};
    };
    BaseEthersHanlder.prototype.getName = function () {
        return "";
    };
    BaseEthersHanlder.prototype.getWallet = function (keychain) {
        var wif = keychain.derivePath("m/44'/60'/0'/0/0");
        var keyPair = bitcoinjs_lib_1.ECPair.fromWIF(wif);
        var ret = keyPair.privateKey.toString('hex');
        while (ret.length < 64)
            ret = "0" + ret;
        var priv = "0x" + ret;
        return new ethers_1.ethers.Wallet(priv);
    };
    BaseEthersHanlder.prototype.getReceiveAddr = function (keychain) {
        return this.getWallet(keychain).address;
    };
    BaseEthersHanlder.prototype.getTicker = function () {
        return "";
    };
    BaseEthersHanlder.prototype.prepareTransaction = function (keychain, receiverAddr, amount, fee) {
        return __awaiter(this, void 0, void 0, function () {
            var from, tx, _a, _b, signed;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        from = this.getReceiveAddr(keychain);
                        tx = {
                            to: receiverAddr,
                            value: "0x" + amount.toString(16),
                            gasPrice: fee,
                            gasLimit: 21000,
                            nonce: "0"
                        };
                        _a = tx;
                        _b = "0x";
                        return [4, this.getProvider().getTransactionCount(from)];
                    case 1:
                        _a.nonce = _b + (_c.sent()).toString(16);
                        return [4, this.getWallet(keychain).signTransaction(tx)];
                    case 2:
                        signed = _c.sent();
                        return [2, new EthTransaction(this, tx, signed)];
                }
            });
        });
    };
    BaseEthersHanlder.prototype.validateAddress = function (addr) {
        return ethers_1.ethers.utils.isAddress(addr);
    };
    return BaseEthersHanlder;
}());
exports.BaseEthersHanlder = BaseEthersHanlder;
//# sourceMappingURL=BaseEthersHanlder.js.map