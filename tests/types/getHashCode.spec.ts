/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import { Types } from "../../src/types";

describe("Objs.Types.getHashCode", () => {
    const sut = Types;

    it("returns same values for booleans that are clone", () => {
        const firstActual = sut.getHashCode(true);
        const secondActual = sut.getHashCode(true);
        expect(firstActual).toEqual(secondActual);
    });

    it("returns different values for booleans that are not clone", () => {
        const firstActual = sut.getHashCode(true);
        const secondActual = sut.getHashCode(false);
        expect(firstActual).not.toEqual(secondActual);
    });

    it("returns same values for numbers that are clone", () => {
        const firstActual = sut.getHashCode(3.14);
        const secondActual = sut.getHashCode(3.14);
        expect(firstActual).toEqual(secondActual);
    });

    it("returns different values for numbers that are not clone", () => {
        const firstActual = sut.getHashCode(3.14);
        const secondActual = sut.getHashCode(1.59);
        expect(firstActual).not.toEqual(secondActual);
    });

    it("returns same values for strings that are clone", () => {
        const firstActual = sut.getHashCode("test");
        const secondActual = sut.getHashCode("test");
        expect(firstActual).toEqual(secondActual);
    });

    it("returns different values for strings that are not clone", () => {
        const firstActual = sut.getHashCode("test1");
        const secondActual = sut.getHashCode("test2");
        expect(firstActual).not.toEqual(secondActual);
    });

    it("returns same values for objects that are clone", () => {
        const firstActual = sut.getHashCode({"prop": "val"});
        const secondActual = sut.getHashCode({"prop": "val"});
        expect(firstActual).toEqual(secondActual);
    });

    it("returns different values for objects that are not clone", () => {
        const firstActual = sut.getHashCode({"prop": "val"});
        const secondActual = sut.getHashCode({"prop": "other"});
        expect(firstActual).not.toEqual(secondActual);
    });

    it("returns same values for arrays that are clone", () => {
        const firstActual = sut.getHashCode([{"prop": "val"}]);
        const secondActual = sut.getHashCode([{"prop": "val"}]);
        expect(firstActual).toEqual(secondActual);
    });

    it("returns different values for objects that are not clone", () => {
        const firstActual = sut.getHashCode([{"prop": "val"}]);
        const secondActual = sut.getHashCode([{"prop": "other"}]);
        expect(firstActual).not.toEqual(secondActual);
    });
});