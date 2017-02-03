/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/types.ts" />
describe("Objs.Types.isDate", () => {
    const sut = Objs.Types;

     it("returns true if date", () => {
        const actual = sut.isDate(new Date());
        expect(actual).toBe(true);
    });
});