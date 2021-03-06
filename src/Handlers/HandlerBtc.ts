import {BaseBitcoinjsHanlder} from "./BaseBitcoinjsHanlder";
var coininfo = require('coininfo');

export class HandlerBtc extends BaseBitcoinjsHanlder {

    testCoin = false
    ticker = "BTC";
    code = "BTC";
    name = "Bitcoin";
    icon = "btc";
    description = "via Wikpedia: Bitcoin is a cryptocurrency and worldwide payment system. " +
        "It is the first decentralized digital currency, as the system works without a central bank or single administrator. " +
        "The network is peer-to-peer and transactions take place between users directly, without an intermediary. " +
        "These transactions are verified by network nodes through the use of cryptography and recorded in a public distributed ledger called a blockchain. " +
        "Bitcoin was invented by an unknown person or group of people under the name Satoshi Nakamoto and released as open-source software in 2009. ";
    links = {
        'bitcoin.org' : 'https://bitcoin.org/'
    };

    webapiHost = 'api.blockcypher.com'
    webapiPath = '/v1/btc/main'
    network = coininfo.bitcoin.main.toBitcoinJS()
    keyPath = "m/44'/0'/0'/0/0"
    segwitSupport = true

    coinGeckoId = 'bitcoin';
    coinMarketCapId = 'bitcoin';
    coinPaprikaId = 'btc-bitcoin';

    explorerLinkAddr(address : string) {
        return 'https://www.blockchain.com/btc/address/' + address;
    }

    explorerLinkTx(txid : string) {
        return 'https://www.blockchain.com/btc/tx/' + txid;
    }
}
