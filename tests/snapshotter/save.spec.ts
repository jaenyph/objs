/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import {
    Snapshotter,
    ISnapshotterConfiguration,
    SnapshotKind,
    PropertyNameCasingKind,
    IdentificationKind
} from "../../src/snapshots/snapshotter";

describe("Snapshotter.save", () => {
    const notDefinedErrorMessage = "value is not defined";
    const primitiveErrorMessage = "could not act on a primitive value";
    const missingIdErrorMessage = "value does not defined an 'id' property";
    const notTrackedErrorMessage = "value has no snapshots";
    let sutConfiguration:ISnapshotterConfiguration;

    const getSut = () => {
        if(sutConfiguration === undefined){
            throw new Error("sut configuration not set");
        }
        return new Snapshotter(sutConfiguration);
    };

    const withReferenceTracking = () => {
        sutConfiguration = {
            historyDepth : 1,
            snapshotKind : SnapshotKind.DeepClone,
            propertyNameCasingKind : PropertyNameCasingKind.LowerCamelCase,
            identificationKind : IdentificationKind.Reference
        };
    }

    const withIdTracking = () => {
        sutConfiguration = {
            historyDepth : 1,
            snapshotKind : SnapshotKind.DeepClone,
            propertyNameCasingKind : PropertyNameCasingKind.LowerCamelCase,
            identificationKind : IdentificationKind.Id
        };
    }

    beforeEach(() => {
        sutConfiguration = undefined as any as ISnapshotterConfiguration;
    });

    it("does not throw when trying to save an untracked object in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.save.bind(sut, {})).not.toThrowError(notTrackedErrorMessage);
    });

    it("does not throw when trying to save an untracked object in id tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.save.bind(sut, { "id": 1 })).not.toThrowError(notTrackedErrorMessage);
    });
    
    it("throws when trying to save null in reference tracking mode", () => {
        withReferenceTracking();
        const valueToSave = null;
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to save null in id tracking mode", () => {
        withIdTracking();
        const valueToSave = null;
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to save undefined in reference tracking mode", () => {
        withReferenceTracking();
        const valueToSave = undefined;
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to save undefined in id tracking mode", () => {
        withIdTracking();
        const valueToSave = undefined;
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(notDefinedErrorMessage);
    });

    it("throws when trying to save a boolean in reference tracking mode", () => {
        withReferenceTracking();
        const valueToSave = true;
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to save a boolean in id tracking mode", () => {
        withIdTracking();
        const valueToSave = true;
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(missingIdErrorMessage);
    });

    it("throws when trying to save a number in reference tracking mode", () => {
        withReferenceTracking();
        const valueToSave = 3.14;
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to save a number in id tracking mode", () => {
        withIdTracking();
        const valueToSave = 3.14;
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(missingIdErrorMessage);
    });

    it("throws when trying to save a string in reference tracking mode", () => {
        withReferenceTracking();
        const valueToSave = "abc";
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to save a string in id tracking mode", () => {
        withIdTracking();
        const valueToSave = "abc";
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(missingIdErrorMessage);
    });

    it("does not throws when trying to save a date in reference tracking mode", () => {
        withReferenceTracking();
        const valueToSave = new Date();
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).not.toThrowError(primitiveErrorMessage);
    });

    it("throws when trying to save a date in id tracking mode", () => {
        withIdTracking();
        const valueToSave = new Date();
        const sut = getSut();
        expect(sut.save.bind(sut, valueToSave)).toThrowError(missingIdErrorMessage);
    });

    it("does not throw with given value in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        const valueToSave = {
            "nested" : {
                "prop" : "val"
            },
            "array" : [{
                "nested" : {
                    "prop" : "val"
                }
            }]
        };

        expect(sut.save.bind(sut, valueToSave)).not.toThrow();
    });

    it("does not alter given value in reference tracking mode", () => {
        // arrange
        withReferenceTracking();
        const sut = getSut();
        const tracked = {
            "prop" : "old"
        };

        // act
        sut.save(tracked);

        // assert
        const actual = sut.revert(tracked);
        expect(actual).toEqual(tracked);
    });
});