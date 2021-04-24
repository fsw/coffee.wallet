import {Keychain} from "../Keychain";
import {BigNum} from "../Core/BigNum";
import * as bip32 from "bip32";
import {Wallet} from "../Wallet";
import {BaseEthersHanlder} from "./BaseEthersHanlder";

export interface BaseCoinHandler {
  decimals : number
  testCoin: boolean
  onlineCoin: boolean
  code: string
  ticker: string
  name : string
  icon : string
  description : string
  links : { [key: string]: string }
}

export interface NewTransaction {
  handler: OnlineCoinHandler
  getBalanceAfter() : string
  getFeeDisplay() : string
  getFeeETA() : string
  getAmountDisplay() : string
  getRecipientDisplay() : string
  getSummary() : { [code: string] : string }
  send() : Promise<string>
}

export class Balance {
  handler: BaseCoinHandler
  amount: BigNum
  unconfirmed: BigNum
  constructor(handler: BaseCoinHandler, amount: BigNum, unconfirmed: BigNum) {
    this.handler = handler
    this.amount = amount
    this.unconfirmed = unconfirmed
  }
  total() : BigNum {
    return this.amount.add(this.unconfirmed)
  }
  totalFloat() : number {
    return this.amount.add(this.unconfirmed).toFloat(this.handler.decimals)
  }
  equals(other: Balance) : boolean {
    return other.total().toString() === this.total().toString();
  }
}

export interface OnlineCoinHandler extends BaseCoinHandler {
  getPrivateKey(keychain: Keychain) : bip32.BIP32Interface
  getReceiveAddr(keychain: Keychain) : string
  prepareTransaction(
      keychain: Keychain,
      receiverAddr : string,
      amount : BigNum,
      fee: number,
  ) : Promise<NewTransaction>
  getFeeOptions () : Promise<number[]>
  validateAddress(addr : string) : boolean
  getOwnBalance(keychain: Keychain) : Promise<Balance>
  getBalance(addr : string) : Promise<Balance>
  getIdenticonSeed(addr : string) : number
  explorerLinkAddr(address : string) : string
  explorerLinkTx(txid : string) : string
  canSendViaMessage() : boolean
  newRandomPrivateKey() : string
  addressFromPrivateKey(pk: string) : string
}


