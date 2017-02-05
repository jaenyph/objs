/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/state.ts" />
describe("Objs.State.isChanged", () => {
    const notDefinedErrorMessage = "value is not defined";
    const primitiveErrorMessage = "could not act on a primitive value";
    const missingIdErrorMessage = "value does not defined an 'id' key";
    const notTrackedErrorMessage = "object is not tracked";
    let sutConfiguration: Objs.IStateConfiguration;

    const getSut = () => {
        if (sutConfiguration === undefined) {
            throw new Error("sut configuration not set");
        }
        return new Objs.State(sutConfiguration);
    };

    const withReferenceTracking = () => {
        sutConfiguration = {
            historyDepth: 1,
            pristineKind: Objs.PristineKind.DeepClone,
            propertyNameCasingKind: Objs.PropertyNameCasingKind.LowerCamelCase,
            trackingKind: Objs.TrackingKind.Reference
        };
    }

    const withIdTracking = () => {
        sutConfiguration = {
            historyDepth: 1,
            pristineKind: Objs.PristineKind.DeepClone,
            propertyNameCasingKind: Objs.PropertyNameCasingKind.LowerCamelCase,
            trackingKind: Objs.TrackingKind.Id
        };
    }

    beforeEach(() => {
        sutConfiguration = undefined as any as Objs.IStateConfiguration;
    });

    it("throw when trying to check an untracked object in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.isChanged.bind(sut, {})).toThrowError(notTrackedErrorMessage);
    });

    it("throw when trying to check an untracked object in id tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.isChanged.bind(sut, { "id": 1 })).toThrowError(notTrackedErrorMessage);
    });

    it("throws when trying to check null in reference tracking mode", () => {
        withReferenceTracking();
        const valueToSave = null;
        const sut = getSut();
        expect(sut.isChanged.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to check null in id tracking mode", () => {
        withIdTracking();
        const valueToSave = null;
        const sut = getSut();
        expect(sut.isChanged.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to check undefined in reference tracking mode", () => {
        withReferenceTracking();
        const valueToSave = undefined;
        const sut = getSut();
        expect(sut.isChanged.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to check undefined in id tracking tracking mode", () => {
        withIdTracking();
        const valueToSave = undefined;
        const sut = getSut();
        expect(sut.isChanged.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to check a boolean in reference tracking mode", () => {
        withReferenceTracking();
        const valueToCheck = true;
        const sut = getSut();
        expect(sut.isChanged.bind(sut, valueToCheck)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to check a boolean in id tracking mode", () => {
        withIdTracking();
        const valueToCheck = true;
        const sut = getSut();
        expect(sut.isChanged.bind(sut, valueToCheck)).toThrowError(missingIdErrorMessage);
    });

    it("throws when trying to check a number in reference tracking mode", () => {
        withReferenceTracking();
        const valueToCheck = 3.14;
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToCheck)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to check a number in id tracking mode", () => {
        withIdTracking();
        const valueToCheck = 3.14;
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToCheck)).toThrowError(missingIdErrorMessage);
    });

    it("throws when trying to check a string in reference tracking mode", () => {
        withReferenceTracking();
        const valueToCheck = "abc";
        const sut = getSut();
        expect(sut.isChanged.bind(sut, valueToCheck)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to check a string in id tracking mode", () => {
        withIdTracking();
        const valueToCheck = "abc";
        const sut = getSut();
        expect(sut.isChanged.bind(sut, valueToCheck)).toThrowError(missingIdErrorMessage);
    });

    it("does not throws when trying to check a date in reference tracking mode", () => {
        withReferenceTracking();
        const valueToCheck = new Date();
        const sut = getSut();
        expect(sut.isChanged.bind(sut, valueToCheck)).not.toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to check a date in id tracking mode", () => {
        withIdTracking();
        const valueToCheck = new Date();
        const sut = getSut();
        expect(sut.isChanged.bind(sut, valueToCheck)).toThrowError(missingIdErrorMessage);
    });

    it("returns false if tracked object properties have not changed in reference tracking mode", () => {
        // arrange
        withReferenceTracking();
        const trackedObject = {
            "prop": "old"
        };
        const sut = getSut();
        sut.save(trackedObject);
        trackedObject.prop = "old";

        // act
        const actual = sut.isChanged(trackedObject);

        // assert
        expect(actual).not.toBe(true);
    });

    it("returns false if tracked object properties have not changed in id tracking mode", () => {
        // arrange
        withIdTracking();
        const trackedObject = {
            "id": 1,
            "prop": "old"
        };
        const sut = getSut();
        sut.save(trackedObject);

        // act
        const actual = sut.isChanged({ "id": 1, "prop": "old" });

        // assert
        expect(actual).not.toBe(true);
    });

    it("returns true if tracked object properties have changed in reference tracking mode", () => {
        // arrange
        withReferenceTracking();
        const trackedObject = {
            "prop": "old"
        };
        const sut = getSut();
        sut.save(trackedObject);
        trackedObject.prop = "new";

        // act
        const actual = sut.isChanged(trackedObject);

        // assert
        expect(actual).toBe(true);
    });

    it("returns true if tracked object properties have changed in id tracking mode", () => {
        // arrange
        withIdTracking();
        const trackedObject = {
            "id": 1,
            "prop": "old"
        };
        const sut = getSut();
        sut.save(trackedObject);

        // act
        const actual = sut.isChanged({ "id": 1, "prop": "new" });

        // assert
        expect(actual).toBe(true);
    });

    it("returns true if tracked object array properties elements have changed in reference tracking mode", () => {
        // arrange
        withReferenceTracking();
        const trackedObject = {
            "prop": [3.14]
        };
        const sut = getSut();
        sut.save(trackedObject);
        trackedObject.prop[0] = 1.59;

        // act
        const actual = sut.isChanged(trackedObject);

        // assert
        expect(actual).toBe(true);
    });

    it("returns true if tracked object array properties elements have changed in id tracking mode", () => {
        // arrange
        withIdTracking();
        const sut = getSut();
        sut.save({
            "id": 1,
            "prop": [3.14]
        });
        const untrackedObject = {
            "id": 1,
            "prop": [1.59]
        }

        // act
        const actual = sut.isChanged(untrackedObject);

        // assert
        expect(actual).toBe(true);
    });

    it("returns true if tracked object nested array elements have changed in reference tracking mode", () => {
        // arrange
        withReferenceTracking();
        const trackedObject = {
            "nested": {
                "prop": [3.14]
            }
        };
        const sut = getSut();
        sut.save(trackedObject);
        trackedObject.nested.prop[0] = 1.59;

        // act
        const actual = sut.isChanged(trackedObject);

        // assert
        expect(actual).toBe(true);
    });

    it("returns true if tracked object nested array elements have changed in id tracking mode", () => {
        // arrange
        withIdTracking();
        const sut = getSut();
        sut.save({
            "id": 1,
            "nested": {
                "prop": [3.14]
            }
        });
        const untrackedObject = {
            "id": 1,
            "nested": {
                "prop": [1.59]
            }
        }

        // act
        const actual = sut.isChanged(untrackedObject);

        // assert
        expect(actual).toBe(true);
    });

    it("returns true if tracked object nested array elements properties have changed in reference tracking mode", () => {
        // arrange
        withReferenceTracking();
        const trackedObject = {
            "nested": {
                "prop": [{ "item": 3.14 }]
            }
        };
        const sut = getSut();
        sut.save(trackedObject);
        trackedObject.nested.prop[0].item = 1.59;

        // act
        const actual = sut.isChanged(trackedObject);

        // assert
        expect(actual).toBe(true);
    });

    it("returns true if tracked object nested array elements properties have changed in id tracking mode", () => {
        // arrange
        withIdTracking();
        const sut = getSut();
        sut.save({
            "id": 1,
            "nested": {
                "prop": [{ "item": 3.14 }]
            }
        });
        const untrackedObject = {
            "id": 1,
            "nested": {
                "prop": [{ "item": 1.59 }]
            }
        }

        // act
        const actual = sut.isChanged(untrackedObject);

        // assert
        expect(actual).toBe(true);
    });
});