/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/comparer.ts" />
describe("Objs.Comparison.Comparer.areEquivalent", () => {
    const sut = Objs.Comparison.Comparer;

    it("return true for two equal booleans", () => {
        const actual = sut.areEquivalent(true, true);
        expect(actual).toBe(true);
    });

    it("return false for two different booleans", () => {
        const actual = sut.areEquivalent(true, false);
        expect(actual).not.toBe(true);
    });

    it("return true for two equal numbers", () => {
        const actual = sut.areEquivalent(3.14, 3.14);
        expect(actual).toBe(true);
    });

    it("return false for two different numbers", () => {
        const actual = sut.areEquivalent(3.14, 1.59);
        expect(actual).not.toBe(true);
    });

    it("return true for two equal strings", () => {
        const actual = sut.areEquivalent("abc", "abc");
        expect(actual).toBe(true);
    });

    it("return false for two different strings", () => {
        const actual = sut.areEquivalent("abc", "def");
        expect(actual).not.toBe(true);
    });

    it("return true for two equal dates", () => {
        const time = new Date().getTime();
        const actual = sut.areEquivalent(new Date(time), new Date(time));
        expect(actual).toBe(true);
    });

    it("return false for two different dates", () => {
        const actual = sut.areEquivalent(new Date(1), new Date(2));
        expect(actual).not.toBe(true);
    });

    it("return true for both empty arrays", () => {
        const actual = sut.areEquivalent([], []);
        expect(actual).toBe(true);
    });

    it("return true for both empty objects", () => {
        const actual = sut.areEquivalent({}, {});
        expect(actual).toBe(true);
    });

    it("return true when ignoring missing undefined properties in first object", () => {
        const options: Objs.Comparison.IEquivalenceComparisonOptions = {
            ignoreMissingPropertyWhenUndefined: true
        };
        const actual = sut.areEquivalent({} as any, { "missing": undefined }, options);
        expect(actual).toBe(true);
    });

    it("return false when not ignoring missing undefined properties in first object", () => {
        const options: Objs.Comparison.IEquivalenceComparisonOptions = {
            ignoreMissingPropertyWhenUndefined: false
        };
        const actual = sut.areEquivalent({} as any, { "missing": undefined }, options);
        expect(actual).toBe(false);
    });

    it("return true when ignoring missing undefined properties in second object", () => {
        const options: Objs.Comparison.IEquivalenceComparisonOptions = {
            ignoreMissingPropertyWhenUndefined: true
        };
        const actual = sut.areEquivalent({ "missing": undefined }, {} as any, options);
        expect(actual).toBe(true);
    });

    it("return false when not ignoring missing undefined properties in second object", () => {
        const options: Objs.Comparison.IEquivalenceComparisonOptions = {
            ignoreMissingPropertyWhenUndefined: false
        };
        const actual = sut.areEquivalent({ "missing": undefined }, {} as any, options);
        expect(actual).toBe(false);
    });

    it("calls isPropertyExcluded when comparison options defines it", () => {
        let isPropertyExcludedCounter = 0;
        const options: Objs.Comparison.IEquivalenceComparisonOptions = {
            isPropertyExcluded : () => { ++isPropertyExcludedCounter; return true;}
        };
        sut.areEquivalent({ "prop": "a" }, {"prop" : "b"} , options);
        expect(isPropertyExcludedCounter).toBeGreaterThan(0);
    });

    it("uses isPropertyExcluded to exclude properties when comparison options defines it", () => {
        const options: Objs.Comparison.IEquivalenceComparisonOptions = {
            isPropertyExcluded : (key) => { return key[0] === "_" }
        };
        const actual = sut.areEquivalent({ "prop": "same", "_discard" : true }, {"prop" : "same", "_discard" : false} , options);
        expect(actual).toBe(true);
    });

    it("calls isPropertyExcluded, with property name and value, when comparison options defines it", () => {
        const options: Objs.Comparison.IEquivalenceComparisonOptions = {
            isPropertyExcluded : (key, value) => { 
                switch(key){
                    case "str":
                    expect(value).toBe("abc");
                    break;
                    case "fnc":
                    expect(typeof value).toBe("function");
                    break;
                }
                return true;
            }
        };
        sut.areEquivalent({ "str": "abc", "fnc" : () => {} }, {"str": "abc", "fnc" : () => {}} , options);
    });

    it("returns true for clone objects with cycles", () => {
        // arrange
        const original = {
            prop : {
                root : undefined,
                arr : []
            }
        };
        original.prop.root = original as any;
        original.prop.arr.push(original as never);
        original.prop.arr.push(original.prop as never);

        const clone = Objs.Cloning.Cloner.deepClone(original);

        // act
        const actual = sut.areEquivalent(original, clone);

        // assert
        expect(actual).toBe(true);
    });

    it("returns false for non clone objects with cycles", () => {
        // arrange
        const original = {
            prop : {
                root : undefined,
                arr : []
            }
        };
        original.prop.root = original as any;
        original.prop.arr.push(original as never);
        original.prop.arr.push(original.prop as never);

        const clone = Objs.Cloning.Cloner.deepClone(original);
        clone.prop.root = clone.prop as any;

        // act
        const actual = sut.areEquivalent(original, clone);

        // assert
        expect(actual).toBe(false);
    });

    it("returns true for clone arrays with cycles", () => {
        // arrange
        const original = [{root:undefined, prop:{arr:[]}}];
        original[0].root = original as any;
        original[0].prop.arr.push(original as never);
        original[0].prop.arr.push(original[0].prop as never);

        const clone = Objs.Cloning.Cloner.deepClone(original);

        // act
        const actual = sut.areEquivalent(original, clone);

        // assert
        expect(actual).toBe(true);
    });

    it("returns false for non clone aarrays with cycles", () => {
        // arrange
        const original = [{root:undefined, prop:{arr:[]}}];
        original[0].root = original as any;
        original[0].prop.arr.push(original as never);
        original[0].prop.arr.push(original[0].prop as never);

        const clone = Objs.Cloning.Cloner.deepClone(original);
        clone[0].prop.arr[0] = clone[0].prop as never;

        // act
        const actual = sut.areEquivalent(original, clone);

        // assert
        expect(actual).toBe(false);
    });
});