import * as BN from "bn.js";

/**
 * Wrapper for BN to easily replace implementation
 */
export class BigNum {

    _bn: BN;

    constructor(value: string | number, base: number = 10) {
        this._bn = new BN(value, base);
    }

    add(other : BigNum) : BigNum {
        var ret = new BigNum("0");
        ret._bn = this._bn.add(other._bn);
        return ret;
    }

    sub(other : BigNum) : BigNum {
        var ret = new BigNum("0");
        ret._bn = this._bn.sub(other._bn);
        return ret;
    }

    mul(other : BigNum) : BigNum {
        var ret = new BigNum("0");
        ret._bn = this._bn.mul(other._bn);
        return ret;
    }

    div(other : BigNum) : BigNum {
        var ret = new BigNum("0");
        ret._bn = this._bn.div(other._bn);
        return ret;
    }

    /**
     * compare. returns -1 (this < other), 0 (this == other), or 1 (this > other)
     */
    cmp(other : BigNum) : -1 | 0 | 1 {
        return this._bn.cmp(other._bn);
    }

    static fromFloat(value: number, decimals : number) : BigNum {
        let s = value.toString()
        let i = s.indexOf('.')
        if (i > -1) {
            decimals = decimals - (s.length - i - 1);
            s = s.slice(0,i) + s.slice(i+1);
        }
        if (decimals >= 0) {
            s = s + "0".repeat(decimals);
        } else {
            s = s.substr(0, s.length + decimals)
        }
        return new BigNum(s);
    }

    toFloat(decimals : number) : number {
        let s = this._bn.abs().toString();
        while (s.length <= decimals) {
            s = "0" + s;
        }
        s = s.slice(0, s.length - decimals) + "." + s.slice(s.length - decimals);
        if (this._bn.isNeg()) {
            s = '-' + s;
        }
        return parseFloat(s);
    }

    isZero() : boolean {
        return this.toString(10) === "0"
    }

    isNegative() : boolean {
        return this._bn.isNeg();
    }

    toString(base : number = 10) : string {
        return this._bn.toString(base);
    }
}