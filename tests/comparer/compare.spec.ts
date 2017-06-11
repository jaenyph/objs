/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/comparer.ts" />
describe("Objs.Comparison.Comparer.compare", () => {
    const sut = Objs.Comparison.Comparer;

    it("consider both empty objects as equivalents", () => {

        const a = {};
        const b = {}

        const actual = sut.compare(a, b);
        expect(actual.areEquivalents).toBe(true);
    });

    it("handles properties missing on left", () => {

        const a = {};
        const b = {
            "prop" : 1
        }

        const actual = sut.compare(a, b);
        expect(actual.missingOnLeft.length).toBe(1);
        expect(actual.missingOnRight.length).toBe(0);
    });

    it("handles properties missing on right", () => {

        const a = {
            "prop" : 1
        }
        const b = {};

        const actual = sut.compare(a, b);
        expect(actual.missingOnLeft.length).toBe(0);
        expect(actual.missingOnRight.length).toBe(1);
    });

    
});