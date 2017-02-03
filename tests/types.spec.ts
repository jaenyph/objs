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

    it("areSameTypes returns true if both boolean", () => {
        const actual = sut.areSameTypes(true, false);
        expect(actual).toBe(true);
    });

    it("areSameTypes returns true if not both boolean", () => {
        const actual = sut.areSameTypes(true, "false");
        expect(actual).not.toBe(true);
    });

    it("areSameTypes returns true if both numbers", () => {
        const actual = sut.areSameTypes(1.2, 2.3);
        expect(actual).toBe(true);
    });

    it("areSameTypes returns true if not both numbers", () => {
        const actual = sut.areSameTypes(1.2, "1.2");
        expect(actual).not.toBe(true);
    });

    it("areSameTypes returns true if both strings", () => {
        const actual = sut.areSameTypes("a", "b");
        expect(actual).toBe(true);
    });

    it("areSameTypes returns true if not both strings", () => {
        const actual = sut.areSameTypes("a", 0xb);
        expect(actual).not.toBe(true);
    });

    it("areSameTypes returns true if both functions", () => {
        const actual = sut.areSameTypes(() => {}, function(){});
        expect(actual).toBe(true);
    });

    it("areSameTypes returns true if not both functions", () => {
        const actual = sut.areSameTypes(()=>{}, "false");
        expect(actual).not.toBe(true);
    });

    it("getHashCode returns same values for booleans that are clone", () => {
        const firstActual = sut.getHashCode(true);
        const secondActual = sut.getHashCode(true);
        expect(firstActual).toEqual(secondActual);
    });

    it("getHashCode returns different values for booleans that are not clone", () => {
        const firstActual = sut.getHashCode(true);
        const secondActual = sut.getHashCode(false);
        expect(firstActual).not.toEqual(secondActual);
    });

    it("getHashCode returns same values for numbers that are clone", () => {
        const firstActual = sut.getHashCode(3.14);
        const secondActual = sut.getHashCode(3.14);
        expect(firstActual).toEqual(secondActual);
    });

    it("getHashCode returns different values for numbers that are not clone", () => {
        const firstActual = sut.getHashCode(3.14);
        const secondActual = sut.getHashCode(1.59);
        expect(firstActual).not.toEqual(secondActual);
    });

    it("getHashCode returns same values for strings that are clone", () => {
        const firstActual = sut.getHashCode("test");
        const secondActual = sut.getHashCode("test");
        expect(firstActual).toEqual(secondActual);
    });

    it("getHashCode returns different values for strings that are not clone", () => {
        const firstActual = sut.getHashCode("test1");
        const secondActual = sut.getHashCode("test2");
        expect(firstActual).not.toEqual(secondActual);
    });

    it("getHashCode returns same values for objects that are clone", () => {
        const firstActual = sut.getHashCode({"prop": "val"});
        const secondActual = sut.getHashCode({"prop": "val"});
        expect(firstActual).toEqual(secondActual);
    });

    it("getHashCode returns different values for objects that are not clone", () => {
        const firstActual = sut.getHashCode({"prop": "val"});
        const secondActual = sut.getHashCode({"prop": "other"});
        expect(firstActual).not.toEqual(secondActual);
    });

    it("getHashCode returns same values for arrays that are clone", () => {
        const firstActual = sut.getHashCode([{"prop": "val"}]);
        const secondActual = sut.getHashCode([{"prop": "val"}]);
        expect(firstActual).toEqual(secondActual);
    });

    it("getHashCode returns different values for objects that are not clone", () => {
        const firstActual = sut.getHashCode([{"prop": "val"}]);
        const secondActual = sut.getHashCode([{"prop": "other"}]);
        expect(firstActual).not.toEqual(secondActual);
    });
});