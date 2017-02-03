/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/cloner.ts" />
describe("Objs.Cloner.deepClone", () => {
    const sut = Objs.Cloner;

    it("returns new array", () => {
        const originalArray: any[] = [];
        const actual = sut.deepClone(originalArray);
        expect(actual).not.toBe(originalArray);
    });

    it("returns new array with new items", () => {
        const originalArray: any[] = [{}];
        const actual = sut.deepClone(originalArray);
        expect(actual[0]).not.toBe(originalArray[0]);
    });

    it("returns new date", () => {
        const originalObject = new Date();
        const actual = sut.deepClone(originalObject);
        expect(actual).not.toBe(originalObject);
    });

    it("clone date", () => {
        const originalObject = new Date();
        const actual = sut.deepClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("clone string", () => {
        const originalObject = "";
        const actual = sut.deepClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("clone boolean", () => {
        const originalObject = true;
        const actual = sut.deepClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("clone number", () => {
        const originalObject = 3.14;
        const actual = sut.deepClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("returns new object", () => {
        const originalObject = {};
        const actual = sut.deepClone(originalObject);
        expect(actual).not.toBe(originalObject);
    });

    it("clones object properties", () => {
        const notShared = {};
        const originalObject = {
            "notShared": notShared
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.notShared).not.toBe(notShared);
    });

    it("clones object array properties", () => {
        const notShared = [{}];
        const originalObject = {
            "notShared": notShared
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.notShared).not.toBe(notShared);
    });

    it("clones object array properties elements", () => {
        const notShared = [{}];
        const originalObject = {
            "notShared": notShared
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.notShared[0]).not.toBe(notShared[0]);
    });

    it("clones nested object properties", () => {
        const notShared = {};
        const originalObject = {
            "nested": {
                "notShared": notShared
            }
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.nested.notShared).not.toBe(notShared);
    });

    it("clones nested object array properties", () => {
        const notShared = [{}];
        const originalObject = {
            "nested": {
                "notShared": notShared
            }
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.nested.notShared).not.toBe(notShared);
    });

    it("clones nested object array properties elements", () => {
        const notShared = [{}];
        const originalObject = {
            "nested": {
                "notShared": notShared
            }
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.nested.notShared[0]).not.toBe(notShared[0]);
    });
});