import {BaseERC20Handler, BaseEthersHanlder} from "./BaseEthersHanlder";
import {CacheWrapper, Engine, LogInterface} from "../Engine";
import {BaseCoinHandler} from "./BaseCoinHandler";
import {ERC20Handler} from "./HandlerEth";

export class HandlerEthTest extends BaseEthersHanlder {

    testCoin = true
    ticker = "ETH.TST";
    code = "ETH.TST"
    name = "Test Ethereum";
    icon = "eth.test";
    description = "Robsten is an ethereum testing network.";
    links = {
        "Request Test Eth" : "http://faucet.ropsten.be:3001/"
    }
    networkName = 'ropsten'

    coinGeckoId = '';
    coinMarketCapId = '';
    coinPaprikaId = '';

    explorerLinkAddr(address: string): string {
        return 'https://ropsten.etherscan.io/address/' + address;
    }
    explorerLinkTx(txid: string): string {
        return 'https://ropsten.etherscan.io/tx/' + txid;
    }

}

export class ERC20TestHandler extends BaseERC20Handler {

    isERC20TestHandler: boolean = true
    ticker: string
    code: string
    name: string
    icon: string
    description: string
    links: { [key: string]: string; };
    ethContractAddr: string;

    testCoin = true
    feeHandlerCode = 'ETH.TST'
    networkName = 'ropsten';

    coinGeckoId = '';
    coinMarketCapId = '';
    coinPaprikaId = '';

    constructor(
        engine: Engine,
        ticker: string,
        name: string,
        icon: string,
        ethContractAddr: string,
        decimals: number,
        description: string = "",
        links: {[key:string] : string} = {}
    ) {
        super(engine)
        this.ticker = ticker;
        this.code = ticker;
        this.name = name;
        this.icon = icon;
        this.description = this.name + " is an ERC20 test token with no real value. " + description
        this.ethContractAddr = ethContractAddr
        this.decimals = decimals
        this.links = {
            ...links,
            "etherscan.io": "https://etherscan.io/token/" + this.ethContractAddr
        }
    }

}


export function isERC20TestHandler(toBeDetermined: BaseCoinHandler): toBeDetermined is ERC20TestHandler {
    return (('isERC20TestHandler' in toBeDetermined) && (toBeDetermined as ERC20TestHandler).isERC20TestHandler);
}