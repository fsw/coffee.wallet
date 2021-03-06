import {Keychain} from "../Keychain";
import {BigNum} from "../Core/BigNum";
import * as bip32 from "bip32";

export class AmountError extends Error {
  isAmountError: boolean = true;
  constructor(message: string){
    super(message)
  }
}

export function isAmountError(toBeDetermined: Error): toBeDetermined is AmountError {
  return (typeof toBeDetermined === 'object' && toBeDetermined !== null) && ('isAmountError' in (toBeDetermined as AmountError));
}

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

  coinPaprikaId: string
  coinGeckoId: string
  coinMarketCapId: string
}

export interface NewTransaction {
  handler: OnlineCoinHandler

  getDescriptionHtml() : string
  getLeftIcon() : string
  getLeftLabel() : string
  getRightIcon() : string
  getRightLabel() : string

  getBalanceAfter() : Balance
  getFeeTotal() : Balance
  getFeeInfo() : string
  getFeeETA() : string
  getAmountDisplay() : number
  getRecipientDisplay() : string
  getSummary() : { [code: string] : string|Balance }
  send() : Promise<string>
  isValid() : boolean
}

export class NewTransactionWrapper implements NewTransaction {
  tx: NewTransaction
  handler: OnlineCoinHandler;

  constructor(tx: NewTransaction) {
    this.tx = tx;
    this.handler = tx.handler
  }

  getAmountDisplay(): number {
    return this.tx.getAmountDisplay();
  }

  getBalanceAfter(): Balance {
    return this.tx.getBalanceAfter();
  }

  getFeeTotal(): Balance {
    return this.tx.getFeeTotal();
  }

  getFeeInfo(): string {
    return this.tx.getFeeInfo();
  }

  getFeeETA(): string {
    return this.tx.getFeeETA();
  }

  getLeftIcon(): string {
    return this.tx.getLeftIcon();
  }

  getLeftLabel(): string {
    return this.tx.getLeftLabel();
  }

  getRecipientDisplay(): string {
    return this.tx.getRecipientDisplay();
  }

  getRightIcon(): string {
    return this.tx.getRightIcon();
  }

  getRightLabel(): string {
    return this.tx.getRightLabel();
  }

  getSummary(): { [p: string]: string|Balance } {
    return this.tx.getSummary();
  }

  async send(): Promise<string> {
    return await this.tx.send()
  }

  isValid(): boolean {
    return this.tx.isValid();
  }

  getDescriptionHtml(): string {
    return this.tx.getDescriptionHtml();
  }
}

export class Balance {
  isBalance: boolean = true;
  handler: BaseCoinHandler
  amount: BigNum
  unconfirmed: BigNum
  constructor(handler: BaseCoinHandler, amount: BigNum, unconfirmed: BigNum = null) {
    this.handler = handler
    this.amount = amount
    this.unconfirmed = unconfirmed ? unconfirmed : new BigNum("0")
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

export function isBalance(toBeDetermined: any): toBeDetermined is Balance {
  return (typeof toBeDetermined === 'object' && toBeDetermined !== null) && ('isBalance' in (toBeDetermined as Balance));
}

export interface OnlineCoinHandler extends BaseCoinHandler {
  getPrivateKey(keychain: Keychain) : bip32.BIP32Interface
  getReceiveAddr(keychain: Keychain) : string
  prepareTransaction(
      keychain: Keychain|string,
      receiverAddr : string,
      amount : BigNum|"MAX",
      fee?: number,
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
  exportPrivateKey(keychain: Keychain) : string
}



