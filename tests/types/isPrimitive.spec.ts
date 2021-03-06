/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/types.ts" />
describe("Objs.Types.isPrimitive", () => {
    const sut = Objs.Types;

     it("returns true if primitive", () => {
        const actual = sut.isPrimitive(123);
        expect(actual).toBe(true);
    });

    it("returns true if null", () => {
        const actual = sut.isPrimitive(null);
        expect(actual).toBe(true);
    });

    it("returns true if undefined", () => {
        const actual = sut.isPrimitive(undefined);
        expect(actual).toBe(true);
    });
});