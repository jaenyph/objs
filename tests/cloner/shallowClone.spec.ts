/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/cloner.ts" />
describe("Objs.Cloning.Cloner.shallowClone", () => {
    const sut = Objs.Cloning.Cloner;
    
    it("returns new array", () => {
        const originalArray: any[] = [];
        const actual = sut.shallowClone(originalArray);
        expect(actual).not.toBe(originalArray);
    });

    it("returns new array with new items", () => {
        const originalArray: any[] = [{}];
        const actual = sut.shallowClone(originalArray);
        expect(actual[0]).not.toBe(originalArray[0]);
    });

    it("returns new date", () => {
        const originalObject = new Date();
        const actual = sut.shallowClone(originalObject);
        expect(actual).not.toBe(originalObject);
    });

    it("clone date", () => {
        const originalObject = new Date();
        const actual = sut.shallowClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("clone string", () => {
        const originalObject = "";
        const actual = sut.shallowClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("clone boolean", () => {
        const originalObject = true;
        const actual = sut.shallowClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("clone number", () => {
        const originalObject = 3.14;
        const actual = sut.shallowClone(originalObject);
        expect(actual).toEqual(originalObject);
    });

    it("returns new object", () => {
        const originalObject = {};
        const actual = sut.shallowClone(originalObject);
        expect(actual).not.toBe(originalObject);
    });

    it("does not clone object properties", () => {
        const shared = {};
        const originalObject = {
            "shared" : shared
        };
        const actual = sut.shallowClone(originalObject);
        expect(actual.shared).toBe(shared);
    });

    it("does not clone object nested properties", () => {
        const shared = {};
        const originalObject = {
            "nested" : {
                "shared" : shared
            }
        };
        const actual = sut.shallowClone(originalObject);
        expect(actual.nested.shared).toBe(shared);
    });

    it("handles basic object cycles", () =>{
        const root = {
            prop : undefined
        };
        root.prop = root as any;
        
        expect(sut.shallowClone.bind(sut,root)).not.toThrow();
    });

    it("handles basic array cycles", () =>{
        const root:Object[] = [];
        root.push(root);
        
        expect(sut.shallowClone.bind(sut,root)).not.toThrow();
    });

    it("handles nested object cycles", () =>{
        const root = {
            nested : {
                prop : undefined
            }
        };
        root.nested.prop = root as any;
        
        expect(sut.shallowClone.bind(sut,root)).not.toThrow();
    });

    it("handles nested arrays cycles", () =>{
        const root:Object[] = [];
        const nested:Object[] = [];
        nested.push(root);
        root.push(nested);
        
        expect(sut.shallowClone.bind(sut,root)).not.toThrow();
    });

    it("handles nested objects and arrays cycles", () =>{
        const root = {
            nested : {
                arr : [{prop : undefined}]
            }
        };
        root.nested.arr[0].prop = root as any;
        
        expect(sut.shallowClone.bind(sut,root)).not.toThrow();
    });

    it("handles nested arrays and objects cycles", () =>{
        const root: Object[] = [];
        const nested = {
            prop : {
                arr : root
            }
        };
        root.push(nested)
        
        expect(sut.shallowClone.bind(sut,root)).not.toThrow();
    });
});