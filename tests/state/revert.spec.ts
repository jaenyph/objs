/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/state.ts" />
describe("Objs.State.revert", () => {
    const notDefinedErrorMessage = "value is not defined";
    const primitiveErrorMessage = "could not act on a primitive value";
    const missingIdErrorMessage = "value does not defined an 'id' key"
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

    it("throw when trying to revert an untracked object in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.revert.bind(sut, {})).toThrowError(notTrackedErrorMessage);
    });

    it("throw when trying to revert an untracked object in id tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.revert.bind(sut, { "id": 1 })).toThrowError(notTrackedErrorMessage);
    });

    it("throws when trying to revert null in reference tracking mode", () => {
        withReferenceTracking();
        const valueToSave = null;
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to revert null in id tracking mode", () => {
        withIdTracking();
        const valueToSave = null;
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to revert undefined in reference tracking mode", () => {
        withReferenceTracking();
        const valueToSave = undefined;
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to revert undefined in id tracking mode", () => {
        withIdTracking();
        const valueToSave = undefined;
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to revert a boolean in reference tracking mode", () => {
        withReferenceTracking();
        const valueToRevert = true;
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToRevert)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to revert a boolean in id tracking mode", () => {
        withIdTracking();
        const valueToRevert = true;
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToRevert)).toThrowError(missingIdErrorMessage);
    });

    it("throws when trying to revert a number in reference tracking mode", () => {
        withReferenceTracking();
        const valueToRevert = 3.14;
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToRevert)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to revert a number in id tracking mode", () => {
        withIdTracking();
        const valueToRevert = 3.14;
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToRevert)).toThrowError(missingIdErrorMessage);
    });

    it("throws when trying to revert a string in reference tracking mode", () => {
        withReferenceTracking();
        const valueToRevert = "abc";
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToRevert)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to revert a string in id tracking mode", () => {
        withIdTracking();
        const valueToRevert = "abc";
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToRevert)).toThrowError(missingIdErrorMessage);
    });

    it("does not throws when trying to revert a date in reference tracking mode", () => {
        withReferenceTracking();
        const valueToRevert = new Date();
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToRevert)).not.toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to revert a date in id tracking mode", () => {
        withIdTracking();
        const valueToRevert = new Date();
        const sut = getSut();
        expect(sut.revert.bind(sut, valueToRevert)).toThrowError(missingIdErrorMessage);
    });

    it("is reverted to previous state in reference tracking mode", () => {
        // arrange
        withReferenceTracking();
        const tracked = {
            "prop": "old"
        };
        const sut = getSut();
        sut.save(tracked);
        tracked.prop = "new";

        // act
        const actual = sut.revert(tracked);

        // assert
        expect(actual).not.toEqual(tracked);
    });

    it("is reverted to previous state in id tracking mode with same reference", () => {
        // arrange
        withIdTracking();
        const tracked = {
            "id": 1,
            "prop": "old"
        };
        const sut = getSut();
        sut.save(tracked);
        tracked.prop = "new";

        // act
        const actual = sut.revert(tracked);

        // assert
        expect(actual).not.toEqual(tracked);
    });

    it("is reverted to previous state in id tracking mode with another reference", () => {
        // arrange
        withIdTracking();
        const tracked = {
            "id": 1,
            "prop": "old"
        };
        const sut = getSut();
        sut.save(tracked);

        // act
        const actual = sut.revert({ "id": 1 });

        // assert
        expect(actual).toEqual(tracked);
    });

    it("can revert multiple times in reference tracking mode", () => {
        // arrange
        withReferenceTracking();
        sutConfiguration.historyDepth = 3;
        const sut = getSut();
        const trackedObject = {
            "prop" : "old"
        };
        sut.save(trackedObject);
        trackedObject.prop = "new";
        sut.save(trackedObject);
        trackedObject.prop = "last";
        sut.save(trackedObject);

        // act / assert
        expect(sut.revert(trackedObject).prop).toEqual("last");
        expect(sut.revert(trackedObject).prop).toEqual("new");
        expect(sut.revert(trackedObject).prop).toEqual("old");
    });
});