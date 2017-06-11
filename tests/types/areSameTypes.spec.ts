/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import { Types } from "../../src/types";

describe("Objs.Types.areSameTypes", () => {
    const sut = Types;

    it("returns true if both boolean", () => {
        const actual = sut.areSameTypes(true, false);
        expect(actual).toBe(true);
    });

    it("returns false if not both boolean", () => {
        const actual = sut.areSameTypes(true, "false");
        expect(actual).toBe(false);
    });

    it("returns true if both numbers", () => {
        const actual = sut.areSameTypes(1.2, 2.3);
        expect(actual).toBe(true);
    });

    it("returns false if not both numbers", () => {
        const actual = sut.areSameTypes(1.2, "1.2");
        expect(actual).toBe(false);
    });

    it("returns true if both strings", () => {
        const actual = sut.areSameTypes("a", "b");
        expect(actual).toBe(true);
    });

    it("returns false if not both strings", () => {
        const actual = sut.areSameTypes("a", 0xb);
        expect(actual).toBe(false);
    });

    it("returns true if both functions", () => {
        const actual = sut.areSameTypes(() => { }, function () { });
        expect(actual).toBe(true);
    });

    it("returns false if not both functions", () => {
        const actual = sut.areSameTypes(() => { }, "false");
        expect(actual).toBe(false);
    });

    it("returns true if both arrays", () => {
        const actual = sut.areSameTypes([], []);
        expect(actual).toBe(true);
    });

    it("returns false if not both arrays", () => {
        const actual = sut.areSameTypes([], {});
        expect(actual).toBe(false);
    });

    it("returns true if both objects", () => {
        const actual = sut.areSameTypes({}, {});
        expect(actual).toBe(true);
    });

    it("returns false if not both objects", () => {
        const actual = sut.areSameTypes({}, []);
        expect(actual).toBe(false);
    });
});