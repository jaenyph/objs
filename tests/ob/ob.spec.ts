/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import * as Objs from "../../src/ob";

describe("Objs", () => {

    it("can navigate to Types", () => {
        const sut = Objs.Types;
        expect(sut).toBeDefined();
    });

    it("can navigate to Cloner", () => {
        const sut = Objs.Cloning.Cloner;
        expect(sut).toBeDefined();
    });

    it("can navigate to Comparer", () => {
        const sut = Objs.Comparison.Comparer;
        expect(sut).toBeDefined();
    });

    it("can navigate to Snapshotter", () => {
        const sut = Objs.Snapshots.Snapshotter;
        expect(sut).toBeDefined();
    });

});