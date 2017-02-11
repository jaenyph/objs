/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/types.ts" />
describe("Objs.Types.isArray", () => {
    const sut = Objs.Types;

     it("returns true if array", () => {
        const actual = sut.isArray([]);
        expect(actual).toBe(true);
    });
});