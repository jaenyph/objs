/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/state.ts" />
describe("Objs.State.revert", () => {
    const sut = new Objs.State();

    const primitiveErrorMessage: string = "could not act on a primitive value";

    it("throws when trying to revert a boolean", () => {
        const valueToRevert = true;
        expect(sut.revert.bind(sut, valueToRevert)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to revert a number", () => {
        const valueToRevert = 3.14;
        expect(sut.revert.bind(sut, valueToRevert)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to revert a string", () => {
        const valueToRevert = "abc";
        expect(sut.revert.bind(sut, valueToRevert)).toThrowError(primitiveErrorMessage);
    });

    it("does not throws when trying to revert a date", () => {
        const valueToRevert = new Date()
        expect(sut.revert.bind(sut, valueToRevert)).not.toThrowError(primitiveErrorMessage);
    });
});