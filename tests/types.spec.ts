/// <reference path="../typings/globals/jasmine/index.d.ts" />
/// <reference path="../src/types.ts" />
describe("Objs.Types", () => {
    const sut = Objs.Types;
    it("isArray returns true if array", () => {
        const actual = sut.isArray([]);
        expect(actual).toBe(true);
    });

    it("isDate returns true if date", () => {
        const actual = sut.isDate(new Date());
        expect(actual).toBe(true);
    });

    it("isDefined returns true if not null and not undefined", () => {
        const actual = sut.isDefined(123);
        expect(actual).toBe(true);
    });

    it("isDefined returns true if empty string", () => {
        const actual = sut.isDefined("");
        expect(actual).toBe(true);
    });

    it("isDefined returns false if null", () => {
        const actual = sut.isDefined(null);
        expect(actual).not.toBe(true);
    });

    it("isDefined returns false if undefined", () => {
        const actual = sut.isDefined(undefined);
        expect(actual).not.toBe(true);
    });

    it("isDefined returns true if function", () => {
        const actual = sut.isFunction(function(){});
        expect(actual).toBe(true);
    });

    it("isNative returns true if primitive", () => {
        const actual = sut.isNative(123);
        expect(actual).toBe(true);
    });

    it("isNative returns true if date", () => {
        const actual = sut.isNative(new Date());
        expect(actual).toBe(true);
    });

    it("isNative returns true if array", () => {
        const actual = sut.isNative([]);
        expect(actual).toBe(true);
    });

    it("isNative returns true if function", () => {
        const actual = sut.isNative(function(){});
        expect(actual).toBe(true);
    });

    it("isPrimitive returns true if primitive", () => {
        const actual = sut.isPrimitive(123);
        expect(actual).toBe(true);
    });

    it("isPrimitive returns true if null", () => {
        const actual = sut.isPrimitive(null);
        expect(actual).toBe(true);
    });

    it("isPrimitive returns true if undefined", () => {
        const actual = sut.isPrimitive(undefined);
        expect(actual).toBe(true);
    });
});