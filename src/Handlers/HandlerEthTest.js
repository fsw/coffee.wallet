"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEthersHanlder_1 = require("./BaseEthersHanlder");
var HandlerEthTest = (function (_super) {
    __extends(HandlerEthTest, _super);
    function HandlerEthTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.testCoin = true;
        _this.ticker = "ETH.TST";
        _this.name = "Test Ether";
        _this.icon = "eth.test";
        _this.description = "Robsten is an ethereum testing network.";
        _this.links = {
            "Request Test Eth": "http://faucet.ropsten.be:3001/"
        };
        _this.networkName = 'homestead';
        return _this;
    }
    HandlerEthTest.prototype.explorerLinkAddr = function (address) {
        return 'https://ropsten.etherscan.io/address/' + address;
    };
    HandlerEthTest.prototype.explorerLinkTx = function (txid) {
        return 'https://ropsten.etherscan.io/tx/' + txid;
    };
    return HandlerEthTest;
}(BaseEthersHanlder_1.BaseEthersHanlder));
exports.HandlerEthTest = HandlerEthTest;
//# sourceMappingURL=HandlerEthTest.js.map