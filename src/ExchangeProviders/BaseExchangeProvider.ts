import {Engine} from "../Engine";
import {NewTransaction} from "../Handlers/BaseCoinHandler";

export abstract class BaseExchangeProvider {

  engine: Engine
  key: string
  name: string
  url: string
  testNet: boolean = false

  shortDescription: string = "<strong>warning:</strong> this is handled by external provider. You will send your coins to a third party trusting you will get exchanged coins back after few minutes. Please refer to provider website for more details:"

  constructor(engine: Engine) {
    this.engine = engine;
  }

  abstract getCurrencies() : Promise<string[]>
  abstract getMinAmount(from: string, to: string) : Promise<number>
  abstract estimateExchangeAmount(from: string, to: string, amount: number) : Promise<number>
  abstract createTransaction(from: string, to: string, amount: number, returnTo: string) : Promise<NewTransaction>

}
