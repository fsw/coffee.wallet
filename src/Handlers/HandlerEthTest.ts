import {BaseERC20Handler, BaseEthersHanlder} from "./BaseEthersHanlder";
import {CacheWrapper, LogInterface} from "../Engine";

export class HandlerEthTest extends BaseEthersHanlder {

    testCoin = true
    ticker = "ETH.TST";
    name = "Test Ethereum";
    icon = "eth.test";
    description = "Robsten is an ethereum testing network.";
    links = {
        "Request Test Eth" : "http://faucet.ropsten.be:3001/"
    }
    networkName = 'ropsten'

    explorerLinkAddr(address: string): string {
        return 'https://ropsten.etherscan.io/address/' + address;
    }
    explorerLinkTx(txid: string): string {
        return 'https://ropsten.etherscan.io/tx/' + txid;
    }

}

export class ERC20TestHandler extends BaseERC20Handler {

    testCoin = true
    onlineCoin = false;
    ticker: string
    name: string
    icon: string
    description: string
    links: { [key: string]: string; };

    ethContractAddr: string;
    networkName = 'ropsten';

    constructor(
        log: LogInterface,
        cache: CacheWrapper,
        ticker: string,
        name: string,
        icon: string,
        ethContractAddr: string,
        decimals: number
    ) {
        super(log, cache)
        this.ticker = ticker;
        this.name = name;
        this.icon = icon;
        this.description = this.name + " is a ERC20 test token with no real value"
        this.ethContractAddr = ethContractAddr
        this.decimals = decimals
        this.links = {
            "etherscan.io": "https://etherscan.io/token/" + this.ethContractAddr
        }
    }

}
