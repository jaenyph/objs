/// <reference path="types.ts" />
namespace Objs.Snapshots {

    /** Configuration for the Snapshotter */
    export interface ISnapshotterConfiguration {
        /** The maximum snapshots to store for an object */
        historyDepth: number;
        /** The way to identify a snapshot */
        identificationKind: IdentificationKind;
        /** The kind of snapshots to store */
        snapshotKind: SnapshotKind;
        /** The kind of casing to use when accessing snapshots properties names */
        propertyNameCasingKind: PropertyNameCasingKind;
    }

    /** Snapshot identification kind */
    export enum IdentificationKind {
        /** Rely on references for identifying a snapshot */
        Reference = 1,
        /** Rely on snapshot's id property for tracking */
        Id = 2
    }

    /** Kind of snapshot */
    export enum SnapshotKind {
        /** Perform deep clones snapshots */
        DeepClone = 0,
        /** Perform shallow clones snapshots */
        ShallowClone = 1
    }

    /** The casing scheme used for snapshots properties names  */
    export enum PropertyNameCasingKind {
        LowerCamelCase = 0,
        UpperCamelCase = 1
    }

    /**
     * Perform snapshots of objects, allowing creating objects' states history
     */
    export class Snapshotter {

        private snapshots: Map<Object, Object[]>
        private configuration: ISnapshotterConfiguration;

        private static defaultConfiguration: ISnapshotterConfiguration = {
            historyDepth: 7,
            identificationKind: IdentificationKind.Reference,
            snapshotKind: SnapshotKind.DeepClone,
            propertyNameCasingKind: PropertyNameCasingKind.LowerCamelCase
        };

        /** Instanciate a new Snapshotter */
        constructor(configuration?: ISnapshotterConfiguration) {

            if (configuration === null) {
                throw new Error("configuration can not be null");
            }

            configuration = configuration || Snapshotter.defaultConfiguration;

            // check configuration for inconsistencies
            if (configuration.historyDepth < 1) {
                throw new Error("historyDepth could not be less than 1");
            }

            this.snapshots = new Map<Object, Object[]>();
            this.configuration = configuration;
        }

        private getCasedIdPropertyName(): string {
            switch (this.configuration.propertyNameCasingKind) {
                case PropertyNameCasingKind.LowerCamelCase:
                    return "id";
                case PropertyNameCasingKind.UpperCamelCase:
                    return "Id";
                default:
                    throw new Error("unsupported casing");
            }
        }

        /** Clear all snapshots */
        public clearAll(): Snapshotter {
            this.snapshots.forEach((history) => {
                history.splice(0, history.length);
            })
            this.snapshots.clear();
            return this;
        }

        /** Get the identifier value for our snapshots history */
        private getIdentifier(value: Object): any {
            switch (this.configuration.identificationKind) {
                case IdentificationKind.Reference:
                    return value;
                case IdentificationKind.Id:
                    return value[this.getCasedIdPropertyName()];
                default:
                    throw new Error("unhandled identification kind");
            }
        }

        private ensureObjectDefinedOrThrow(value: Object): void {
            if (!Objs.Types.isDefined(value)) {
                throw new Error("value is not defined");
            }
            if (this.configuration.identificationKind === Objs.Snapshots.IdentificationKind.Id) {
                if (!value.hasOwnProperty(this.getCasedIdPropertyName())) {
                    throw new Error(`value does not defined an '${this.getCasedIdPropertyName()}' property`);
                }
                value.isPrototypeOf
            }
            if (Objs.Types.isPrimitive(value)) {
                throw new Error("could not act on a primitive value");
            }
        }

        private getHistory<T>(value: T): T[] {
            const trackingKey = this.getIdentifier(value);
            if (!this.snapshots.has(trackingKey)) {
                return undefined as any as T[];
            }
            return (this.snapshots.get(trackingKey) as T[]);
        }

        private getHistoryOrThrow<T>(value: T): T[] {
            const history = this.getHistory(value);
            if (history === undefined) {
                throw new Error("value has no snapshots");
            }
            return history;
        }

        /**
         * Whether or not the given value has any snapshots
         * @param value : The object to check
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public has(value: Object): boolean {
            this.ensureObjectDefinedOrThrow(value);
            const history = this.getHistory(value);
            return (history === undefined) ? false : history.length > 0;
        }

        /**
         * Whether or not the given value has changed compared to its last snapshot
         * @param value : The object to check
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public isChanged(value: Object, comparisonOptions?: Objs.Comparison.IEquivalenceComparisonOptions): boolean {

            this.ensureObjectDefinedOrThrow(value);

            return !Objs.Comparison.Comparer.areEquivalent(value, this.getHistoryOrThrow(value)[0], comparisonOptions);
        }

        private clone<T>(value: T): T {
            switch (this.configuration.snapshotKind) {
                case SnapshotKind.DeepClone:
                    return Objs.Cloning.Cloner.deepClone(value);
                case SnapshotKind.ShallowClone:
                    return Objs.Cloning.Cloner.shallowClone(value);
                default:
                    throw new Error("unhandled snapshot kind");
            }
        }

        private cloneTo<T>(source: T, target: Object): T {
            switch (this.configuration.snapshotKind) {
                case SnapshotKind.DeepClone:
                    return Objs.Cloning.Cloner.deepCloneTo(source, target);
                case SnapshotKind.ShallowClone:
                    return Objs.Cloning.Cloner.shallowCloneTo(source, target);
                default:
                    throw new Error("unhandled snapshot kind");
            }
        }

        /**
         * Save the given value to a new snapshot
         * @param value : The object to save
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public save(value: Object): Snapshotter {

            this.ensureObjectDefinedOrThrow(value);

            let history = this.getHistory(value);
            if (history === undefined) {
                this.snapshots.set(this.getIdentifier(value), [this.clone(value)]);
                return this;
            }

            if (Objs.Comparison.Comparer.areEquivalent(value, history[0])) {
                return this;
            }

            const clone = this.clone(value);
            const historyLenght = history.unshift(clone);
            if (historyLenght > this.configuration.historyDepth) {
                history.pop();
            }
            return this;
        }

        /**
         * Clear the the snapshots related to the given value
         * @param value : The object to clear the related snapshots
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public clear(value: Object): Snapshotter {

            this.ensureObjectDefinedOrThrow(value);

            const history = this.getHistoryOrThrow(value);

            history.splice(0, history.length, this.clone(value));

            return this;
        }

		/**
         * Peek the last snapshot without revertion
         * @param value : The object to peek the last snapshot
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public peek<T>(value: T): T {

            this.ensureObjectDefinedOrThrow(value);

            const history = this.getHistoryOrThrow(value);

            if (history.length === 0) {
                throw new Error("snapshot could not be peeked");
            }

            return history[0] as T;
        }

        /**
         * Revert given value to the last snapshot
         * @param value : The object to revert with the last snapshot
         * @returns the last snapshot
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public revert<T>(value: T): T {

            this.ensureObjectDefinedOrThrow(value);

            const history = this.getHistoryOrThrow(value);

            if (history.length === 0) {
                throw new Error("value could not be more reverted");
            }

            return this.cloneTo(history.shift() as T, value);
        }
    }
}