/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/types.ts" />
describe("Objs.Types.isDefined", () => {
    const sut = Objs.Types;

    it("returns true if not null and not undefined", () => {
        const actual = sut.isDefined(123);
        expect(actual).toBe(true);
    });

    it("returns true if empty string", () => {
        const actual = sut.isDefined("");
        expect(actual).toBe(true);
    });

    it("returns false if null", () => {
        const actual = sut.isDefined(null);
        expect(actual).not.toBe(true);
    });

    it("returns false if undefined", () => {
        const actual = sut.isDefined(undefined);
        expect(actual).not.toBe(true);
    });

    it("returns true if function", () => {
        const actual = sut.isFunction(function () { });
        expect(actual).toBe(true);
    });
});