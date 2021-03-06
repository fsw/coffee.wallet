import { HandlerBtc } from "../src/Handlers/HandlerBtc";
import { strictEqual, notStrictEqual } from "assert";
import {Keychain} from "../src/Keychain";
import {mnemonic1, mnemonic2} from "./_data";
import {CacheMock, LogMock, StorageMock} from "./_mocks";
import {Engine} from "../src/Engine";

describe('Bitcoin Test', function() {
    describe('mnemonics', function () {
        let keychain1 = new Keychain(mnemonic1);
        let keychain2 = new Keychain(mnemonic2);
        let engine = new Engine(
            new StorageMock(),
            new LogMock(),
            new CacheMock()
        );
        let handler = new HandlerBtc(engine);
        it('should validate addresses', function () {
            strictEqual(
                handler.validateAddress("1F6ShUUd63cainj6DgZfBk7kChiNB4YEwR"),
                true
            );
            strictEqual(
                handler.validateAddress("35bSzXvRKLpHsHMrzb82f617cV4Srnt7hS"),
                true
            );
            strictEqual(
                handler.validateAddress("abcd"),
                false
            );
            strictEqual(
                handler.validateAddress("0x56a591691fC2be24d397b397E42827abaf4F3dC7"),
                false
            );
        });

    });
});
