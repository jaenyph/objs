/// <reference path="../typings/globals/jasmine/index.d.ts" />
/// <reference path="../src/cloner.ts" />
describe("Objs.Cloner", () => {
    const sut = Objs.Cloner;
    it("shallowClone returns new array", () => {
        const originalArray: any[] = [];
        const actual = sut.shallowClone(originalArray);
        expect(actual).not.toBe(originalArray);
    });

    it("shallowClone returns new array with new items", () => {
        const originalArray: any[] = [{}];
        const actual = sut.shallowClone(originalArray);
        expect(actual[0]).not.toBe(originalArray[0]);
    });

    it("shallowClone returns new date", () => {
        const originalObject = new Date();
        const actual = sut.shallowClone(originalObject);
        expect(actual).not.toBe(originalObject);
    });

    it("shallowClone clone date", () => {
        const originalObject = new Date();
        const actual = sut.shallowClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("shallowClone clone string", () => {
        const originalObject = "";
        const actual = sut.shallowClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("shallowClone clone boolean", () => {
        const originalObject = true;
        const actual = sut.shallowClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("shallowClone clone number", () => {
        const originalObject = 3.14;
        const actual = sut.shallowClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("shallowClone returns new object", () => {
        const originalObject = {};
        const actual = sut.shallowClone(originalObject);
        expect(actual).not.toBe(originalObject);
    });

    it("shallowClone does not clone object properties", () => {
        const shared = {};
        const originalObject = {
            "shared" : shared
        };
        const actual = sut.shallowClone(originalObject);
        expect(actual.shared).toBe(shared);
    });

    it("shallowClone does not clone object nested properties", () => {
        const shared = {};
        const originalObject = {
            "nested" : {
                "shared" : shared
            }
        };
        const actual = sut.shallowClone(originalObject);
        expect(actual.nested.shared).toBe(shared);
    });

    it("deepClone returns new array", () => {
        const originalArray: any[] = [];
        const actual = sut.deepClone(originalArray);
        expect(actual).not.toBe(originalArray);
    });

    it("deepClone returns new array with new items", () => {
        const originalArray: any[] = [{}];
        const actual = sut.deepClone(originalArray);
        expect(actual[0]).not.toBe(originalArray[0]);
    });

    it("deepClone returns new date", () => {
        const originalObject = new Date();
        const actual = sut.deepClone(originalObject);
        expect(actual).not.toBe(originalObject);
    });

    it("deepClone clone date", () => {
        const originalObject = new Date();
        const actual = sut.deepClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("deepClone clone string", () => {
        const originalObject = "";
        const actual = sut.deepClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("deepClone clone boolean", () => {
        const originalObject = true;
        const actual = sut.deepClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("deepClone clone number", () => {
        const originalObject = 3.14;
        const actual = sut.deepClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("deepClone returns new object", () => {
        const originalObject = {};
        const actual = sut.deepClone(originalObject);
        expect(actual).not.toBe(originalObject);
    });

    it("deepClone clones object properties", () => {
        const notShared = {};
        const originalObject = {
            "notShared" : notShared
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.notShared).not.toBe(notShared);
    });

    it("deepClone clones object array properties", () => {
        const notShared = [{}];
        const originalObject = {
            "notShared" : notShared
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.notShared).not.toBe(notShared);
    });

    it("deepClone clones object array properties elements", () => {
        const notShared = [{}];
        const originalObject = {
            "notShared" : notShared
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.notShared[0]).not.toBe(notShared[0]);
    });

    it("deepClone clones nested object properties", () => {
        const notShared = {};
        const originalObject = {
            "nested" : {
                "notShared" : notShared
            }
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.nested.notShared).not.toBe(notShared);
    });

    it("deepClone clones nested object array properties", () => {
        const notShared = [{}];
        const originalObject = {
            "nested" : {
                "notShared" : notShared
            }
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.nested.notShared).not.toBe(notShared);
    });

    it("deepClone clones nested object array properties elements", () => {
        const notShared = [{}];
        const originalObject = {
            "nested" : {
                "notShared" : notShared
            }
        };
        const actual = sut.deepClone(originalObject);
        expect(actual.nested.notShared[0]).not.toBe(notShared[0]);
    });

    it("areClones return true for two equal booleans", () => {
        const actual = sut.areClones(true, true);
        expect(actual).toBe(true);
    });

     it("areClones return false for two different booleans", () => {
        const actual = sut.areClones(true, false);
        expect(actual).not.toBe(true);
    });

    it("areClones return true for two equal numbers", () => {
        const actual = sut.areClones(3.14, 3.14);
        expect(actual).toBe(true);
    });

    it("areClones return false for two different numbers", () => {
        const actual = sut.areClones(3.14, 1.59);
        expect(actual).not.toBe(true);
    });

    it("areClones return true for two equal strings", () => {
        const actual = sut.areClones("abc", "abc");
        expect(actual).toBe(true);
    });

    it("areClones return false for two different strings", () => {
        const actual = sut.areClones("abc", "def");
        expect(actual).not.toBe(true);
    });

    it("areClones return true for two equal dates", () => {
        const time = new Date().getTime();
        const actual = sut.areClones(new Date(time), new Date(time));
        expect(actual).toBe(true);
    });

    it("areClones return false for two different dates", () => {
        const actual = sut.areClones(new Date(1), new Date(2));
        expect(actual).not.toBe(true);
    });

    it("areClones return true for both empty arrays", () => {
        const actual = sut.areClones([], []);
        expect(actual).toBe(true);
    });

    it("areClones return true for both empty objects", () => {
        const actual = sut.areClones({}, {});
        expect(actual).toBe(true);
    });
});