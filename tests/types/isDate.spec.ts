/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import { Types } from "../../src/types";

describe("Objs.Types.isDate", () => {
    const sut = Types;

     it("returns true if date", () => {
        const actual = sut.isDate(new Date());
        expect(actual).toBe(true);
    });
});