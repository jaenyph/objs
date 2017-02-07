/// <reference path="../../typings/globals/jasmine/index.d.ts" />
/// <reference path="../../src/state.ts" />
describe("Objs.States.StateTracker.reset", () => {
    const notDefinedErrorMessage = "value is not defined";
    const primitiveErrorMessage = "could not act on a primitive value";
    const missingIdErrorMessage = "value does not defined an 'id' key"
    const notTrackedErrorMessage = "object is not tracked";
    let sutConfiguration: Objs.States.IStateTrackerConfiguration;

    const getSut = () => {
        if (sutConfiguration === undefined) {
            throw new Error("sut configuration not set");
        }
        return new Objs.States.StateTracker(sutConfiguration);
    };

    const withReferenceTracking = () => {
        sutConfiguration = {
            historyDepth: 1,
            pristineKind: Objs.States.PristineKind.DeepClone,
            propertyNameCasingKind: Objs.States.PropertyNameCasingKind.LowerCamelCase,
            trackingKind: Objs.States.TrackingKind.Reference
        };
    }

    const withIdTracking = () => {
        sutConfiguration = {
            historyDepth: 1,
            pristineKind: Objs.States.PristineKind.DeepClone,
            propertyNameCasingKind: Objs.States.PropertyNameCasingKind.LowerCamelCase,
            trackingKind: Objs.States.TrackingKind.Id
        };
    }

    beforeEach(() => {
        sutConfiguration = undefined as any as Objs.States.IStateTrackerConfiguration;
    });

    it("throw when trying to reset an untracked object in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.reset.bind(sut, {})).toThrowError(notTrackedErrorMessage);
    });

    it("throw when trying to reset an untracked object in id tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.reset.bind(sut, { "id": 1 })).toThrowError(notTrackedErrorMessage);
    });

    it("throws when trying to reset null in reference tracking mode", () => {
        withReferenceTracking();
        const valueToReset = null;
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to reset null in id tracking mode", () => {
        withIdTracking();
        const valueToReset = null;
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to reset undefined in reference tracking mode", () => {
        withReferenceTracking();
        const valueToReset = undefined;
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to reset undefined in id tracking mode", () => {
        withIdTracking();
        const valueToReset = undefined;
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to reset a boolean in reference tracking mode", () => {
        withReferenceTracking();
        const valueToReset = true;
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to reset a boolean in id tracking mode", () => {
        withIdTracking();
        const valueToReset = true;
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(missingIdErrorMessage);
    });

    it("throws when trying to reset a number in reference tracking mode", () => {
        withReferenceTracking();
        const valueToReset = 3.14;
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to reset a number in id tracking mode", () => {
        withIdTracking();
        const valueToReset = 3.14;
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(missingIdErrorMessage);
    });

    it("throws when trying to reset a string in reference tracking mode", () => {
        withReferenceTracking();
        const valueToReset = "abc";
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to reset a string in id tracking mode", () => {
        withIdTracking();
        const valueToReset = "abc";
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(missingIdErrorMessage);
    });

    it("does not throws when trying to reset a date in reference tracking mode", () => {
        withReferenceTracking();
        const valueToReset = new Date();
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).not.toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to reset a date in id tracking mode", () => {
        withIdTracking();
        const valueToReset = new Date();
        const sut = getSut();
        expect(sut.reset.bind(sut, valueToReset)).toThrowError(missingIdErrorMessage);
    });
});