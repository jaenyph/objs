/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import { Cloner } from "../../src/cloning/cloner";

describe("Cloner.deepClone", () => {
    const sut = Cloner;

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

    it("handles basic object cycles", () => {
        const root = {
            prop: undefined
        };
        root.prop = root as any;

        expect(sut.deepClone.bind(sut, root)).not.toThrow();
    });

    it("handles basic array cycles", () => {
        const root: Object[] = [];
        root.push(root);

        expect(sut.deepClone.bind(sut, root)).not.toThrow();
    });

    it("handles nested object cycles", () => {
        const root = {
            nested: {
                prop: undefined
            }
        };
        root.nested.prop = root as any;

        expect(sut.deepClone.bind(sut, root)).not.toThrow();
    });

    it("handles nested arrays cycles", () => {
        const root: Object[] = [];
        const nested: Object[] = [];
        nested.push(root);
        root.push(nested);

        expect(sut.deepClone.bind(sut, root)).not.toThrow();
    });

    it("handles nested objects and arrays cycles", () => {
        const root = {
            nested: {
                arr: [{ prop: undefined }]
            }
        };
        root.nested.arr[0].prop = root as any;

        expect(sut.deepClone.bind(sut, root)).not.toThrow();
    });

    it("handles nested arrays and objects cycles", () => {
        const root: Object[] = [];
        const nested = {
            prop: {
                arr: root
            }
        };
        root.push(nested)

        expect(sut.deepClone.bind(sut, root)).not.toThrow();
    });

    it("cope with instanceof at one level", () => {
        // arrange
        class DummyObject {
        }
        const instance = new DummyObject();

        // act
        const actual = sut.deepClone(instance);

        // assert
        expect(actual instanceof DummyObject).toBe(true);
    });

    it("cope with instanceof at multiple levels", () => {
        // arrange
        class DummyBaseObject {
        }
        class DummyIntermediateObject extends DummyBaseObject {
        }
        class DummyObject extends DummyIntermediateObject {
        }
        const instance = new DummyObject();

        // act
        const actual = sut.deepClone(instance);

        // assert
        expect(actual instanceof DummyBaseObject).toBe(true);
    });
});