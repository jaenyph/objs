/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import { Types } from "../../src/types";

describe("Objs.Types.isNative", () => {
    const sut = Types;

     it("returns true if primitive", () => {
        const actual = sut.isNative(123);
        expect(actual).toBe(true);
    });

    it("returns true if date", () => {
        const actual = sut.isNative(new Date());
        expect(actual).toBe(true);
    });

    it("returns true if array", () => {
        const actual = sut.isNative([]);
        expect(actual).toBe(true);
    });

    it("returns true if function", () => {
        const actual = sut.isNative(function(){});
        expect(actual).toBe(true);
    });
});