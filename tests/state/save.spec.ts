/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/state.ts" />
describe("Objs.State.save", () => {
    const sut = new Objs.State();

    const primitiveErrorMessage: string = "could not act on a primitive value";

    it("throws when trying to save a boolean", () => {
        const valueToSave = true;
        expect(sut.save.bind(sut, valueToSave)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to save a number", () => {
        const valueToSave = 3.14;
        expect(sut.save.bind(sut, valueToSave)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to save a string", () => {
        const valueToSave = "abc";
        expect(sut.save.bind(sut, valueToSave)).toThrowError(primitiveErrorMessage);
    });

    it("does not throws when trying to save a date", () => {
        const valueToSave = new Date()
        expect(sut.save.bind(sut, valueToSave)).not.toThrowError(primitiveErrorMessage);
    });
});