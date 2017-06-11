/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import { Comparer } from "../../src/comparison/comparer";

describe("Comparer.compare", () => {
    const sut = Comparer;

    it("consider both empty objects as equivalents", () => {

        const a = {};
        const b = {}

        const actual = sut.compare(a, b);
        expect(actual.areEquivalents).toBe(true);
    });

    it("handles properties missing on left", () => {

        const a = {};
        const b = {
            "prop": 1
        }

        const actual = sut.compare(a, b);
        expect(actual.missingOnLeft.length).toBe(1);
        expect(actual.missingOnRight.length).toBe(0);
    });

    it("handles properties missing on right", () => {

        const a = {
            "prop": 1
        }
        const b = {};

        const actual = sut.compare(a, b);
        expect(actual.missingOnLeft.length).toBe(0);
        expect(actual.missingOnRight.length).toBe(1);
    });


});