import {Keychain} from "./Keychain";
import {OnlineCoinHandler, BaseCoinHandler, Balance, NewTransaction} from "./Handlers/BaseCoinHandler";
import {PortfolioItem} from "./PortfolioItem";
import {isOnlineCoinHanlder} from "./AllCoinHandlers";
import {BigNum} from "./Core/BigNum";
import {Engine} from "./Engine";

export class Wallet {
    keychain: Keychain;
    handler: BaseCoinHandler;
    engine: Engine;
    code: string;
    portfolio: PortfolioItem[] = [];

    constructor(
        engine: Engine,
        code: string,
        handler: BaseCoinHandler,
        keychain: Keychain
    ) {
        this.engine = engine;
        this.code = code;
        this.handler = handler;
        this.keychain = keychain;
    }

    isOnline() : boolean {
        return isOnlineCoinHanlder(this.handler);
    }
    canSendViaMessage() : boolean {
        return isOnlineCoinHanlder(this.handler) && this.handler.canSendViaMessage()
    }

    getReceiveAddress() : string {
        if (isOnlineCoinHanlder(this.handler)) {
            return this.handler.getReceiveAddr(this.keychain);
        }
    }

    private getRawCachedBalance(key: string) : Balance {
        let cached = this.engine.getCache('wallet.' + this.code + '.' + key, null);
        if (cached !== null) {
            return new Balance(this.handler, new BigNum(cached.confirmed), new BigNum(cached.unconfirmed));
        } else {
            return this.getZeroBalance()
        }
    }
    private setRawCachedBalance(key: string, balance: Balance) : void {
        this.engine.setCache('wallet.' + this.code + '.' + key, {
            confirmed: balance.amount.toString(),
            unconfirmed: balance.unconfirmed.toString()
        });
    }

    getCachedPortfolioTotal() : Balance {
        return this.getRawCachedBalance('CachedPortfolioTotal');
    }

    getCachedPortfolioItemBalance(item: PortfolioItem) : Balance {
        if (PortfolioItem.isBalance(item)) {
            return new Balance(this.handler, BigNum.fromFloat(item.balance, this.handler.decimals));
        } else if (PortfolioItem.isAddress(item) && isOnlineCoinHanlder(this.handler)) {
            return this.getRawCachedBalance('CachedPortfolioItemBalance' + item.address);
        }
    }

    async getPortfolioItemBalance(item: PortfolioItem) : Promise<Balance> {
        if (PortfolioItem.isBalance(item)) {
            return new Balance(this.handler, BigNum.fromFloat(item.balance, this.handler.decimals));
        } else if (PortfolioItem.isAddress(item) && isOnlineCoinHanlder(this.handler)) {
            let balance = await this.handler.getBalance(item.address)
            this.setRawCachedBalance('CachedPortfolioItemBalance' + item.address, balance);
            return balance;
        }
        return this.getZeroBalance();
    }

    async getPortfolioTotal() : Promise<Balance> {
        let total = new Balance(
            this.handler,
            new BigNum("0")
        );

        for (let i in this.portfolio) {
            let item = this.portfolio[i];
            let itemBalance = await this.getPortfolioItemBalance(item)
            total.amount = total.amount.add(itemBalance.amount)
            total.unconfirmed = total.unconfirmed.add(itemBalance.unconfirmed)
        }
        this.setRawCachedBalance('CachedPortfolioTotal', total);
        return total;
    }

    getZeroBalance() : Balance {
        return new Balance(
            this.handler,
            new BigNum("0")
        );
    }

    getCachedBalance() : Balance {
        return this.getRawCachedBalance('CachedBalance');
    }

    async getBalance() : Promise<Balance> {
        if (isOnlineCoinHanlder(this.handler)) {
            let cached = this.getCachedBalance();
            let balance = await this.handler.getOwnBalance(this.keychain);
            console.log(balance);
            console.log(cached);
            if (!balance.equals(cached)) {
                this.setRawCachedBalance('CachedBalance', balance);
                let diff = balance.total().sub(cached.total());
                this.engine.log.info(diff.toString(), this.code);
            }
            return balance;
        } else {
            return this.getZeroBalance()
        }
    }

    async prepareTransaction(receiverAddr : string,
                             amount : BigNum,
                             fee: number) : Promise<NewTransaction> {
        if (!isOnlineCoinHanlder(this.handler)) {
            return null;
        } else {
            return await this.handler.prepareTransaction(this.keychain,receiverAddr,amount,fee);
        }
    }
}
