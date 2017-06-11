/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import {
    Snapshotter,
    ISnapshotterConfiguration,
    SnapshotKind,
    PropertyNameCasingKind,
    IdentificationKind
} from "../../src/snapshots/snapshotter";

describe("Snapshotter.count", () => {
    let sutConfiguration: ISnapshotterConfiguration;

    const getSut = () => {
        if (sutConfiguration === undefined) {
            throw new Error("sut configuration not set");
        }
        return new Snapshotter(sutConfiguration);
    };

    const withReferenceTracking = () => {
        sutConfiguration = {
            historyDepth: 1,
            snapshotKind: SnapshotKind.DeepClone,
            propertyNameCasingKind: PropertyNameCasingKind.LowerCamelCase,
            identificationKind: IdentificationKind.Reference
        };
    }

    const withIdTracking = () => {
        sutConfiguration = {
            historyDepth: 1,
            snapshotKind: SnapshotKind.DeepClone,
            propertyNameCasingKind: PropertyNameCasingKind.LowerCamelCase,
            identificationKind: IdentificationKind.Id
        };
    }

    beforeEach(() => {
        sutConfiguration = undefined as any as ISnapshotterConfiguration;
    });

    it("does not throw when trying to count snapshots for an untracked object in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, {})).not.toThrow();
    });

    it("does not throw when trying to count snapshots for an untracked object in id tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, { "id": 1 })).not.toThrow();
    });

    it("does not throw when trying to count snapshots for null in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, null)).not.toThrow();
    });

    it("does not throw when trying to count snapshots for null in id tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, null)).not.toThrow();
    });

    it("does not throw when trying to count snapshots for undefined in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, undefined)).not.toThrow();
    });

    it("does not throw when trying to count snapshots for undefined in id tracking tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, undefined)).not.toThrow();
    });

    it("does not throw when trying to count snapshots for a boolean in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, true)).not.toThrow();
    });

    it("does not throw when trying to count snapshots for a boolean in id tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, true)).not.toThrow();
    });

    it("does not throw when trying to count snapshots for a number in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, 3.14)).not.toThrow();
    });

    it("does not throw when trying to count snapshots for a number in id tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, 3.14)).not.toThrow();
    });

    it("does not throw when trying to count snapshots for a string in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, "abc")).not.toThrow();
    });

    it("throws when trying to count snapshots for a string in id tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, "abc")).not.toThrow();
    });

    it("does not throw when trying to count snapshots for a missing date in reference tracking mode", () => {
        withReferenceTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, new Date())).not.toThrow();
    });

    it("does not throw when trying to count snapshots for a present date in reference tracking mode", () => {
        withReferenceTracking();
        const valueToCheck = new Date();
        const sut = getSut();
        sut.save(valueToCheck);
        expect(sut.count.bind(sut, valueToCheck)).not.toThrow();
    });

    it("does not throw when trying to count snapshots for a missing date in id tracking mode", () => {
        withIdTracking();
        const sut = getSut();
        expect(sut.count.bind(sut, new Date())).not.toThrow();
    });

    it("returns shapshots history length in reference tracking mode", () => {
        // arrange
        withReferenceTracking();
        sutConfiguration.historyDepth = 3;
        const trackedObject = {
            "prop": "old"
        };
        const sut = getSut();
        sut.save(trackedObject);
        trackedObject.prop = "new";
        sut.save(trackedObject);
        trackedObject.prop = "last";
        sut.save(trackedObject);

        // act
        const actual = sut.count(trackedObject);

        // assert
        expect(actual).toBe(3);
    });

    it("returns snapshots history length in id tracking mode", () => {
        // arrange
        withIdTracking();
        sutConfiguration.historyDepth = 3;

        const trackedObject = {
            "id": 1,
            "prop": "old"
        };
        const sut = getSut();
        sut.save(trackedObject);
        trackedObject.prop = "new";
        sut.save(trackedObject);
        trackedObject.prop = "last";
        sut.save(trackedObject);

        // act
        const actual = sut.count(trackedObject);

        // assert
        expect(actual).toBe(3);
    });

    it("returns 0 if tracked object has no shapshots in reference tracking mode", () => {
        withReferenceTracking();
        expect(getSut().count({})).toBe(0);
    });

    it("returns 0 if tracked object has no shapshots in id tracking mode", () => {
        withIdTracking();
        expect(getSut().count({ "id": 1 })).toBe(0);
    });
});