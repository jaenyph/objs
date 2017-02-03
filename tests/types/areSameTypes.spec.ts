/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/types.ts" />
describe("Objs.Types.areSameTypes", () => {
    const sut = Objs.Types;

     it("returns true if both boolean", () => {
        const actual = sut.areSameTypes(true, false);
        expect(actual).toBe(true);
    });

    it("returns true if not both boolean", () => {
        const actual = sut.areSameTypes(true, "false");
        expect(actual).not.toBe(true);
    });

    it("returns true if both numbers", () => {
        const actual = sut.areSameTypes(1.2, 2.3);
        expect(actual).toBe(true);
    });

    it("returns true if not both numbers", () => {
        const actual = sut.areSameTypes(1.2, "1.2");
        expect(actual).not.toBe(true);
    });

    it("returns true if both strings", () => {
        const actual = sut.areSameTypes("a", "b");
        expect(actual).toBe(true);
    });

    it("returns true if not both strings", () => {
        const actual = sut.areSameTypes("a", 0xb);
        expect(actual).not.toBe(true);
    });

    it("returns true if both functions", () => {
        const actual = sut.areSameTypes(() => {}, function(){});
        expect(actual).toBe(true);
    });

    it("returns true if not both functions", () => {
        const actual = sut.areSameTypes(()=>{}, "false");
        expect(actual).not.toBe(true);
    });
});