/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import { Types } from "../../src/types";

describe("Objs.Types.isArray", () => {
    const sut = Types;

     it("returns true if array", () => {
        const actual = sut.isArray([]);
        expect(actual).toBe(true);
    });
});