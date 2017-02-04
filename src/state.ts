/// <reference path="types.ts" />
namespace Objs {

    /** Configuration for the State manager object */
    export interface IStateConfiguration {
        /** The maximum pristines versions to store for an object */
        historyDepth: number;
        /** The way to track an object for changes */
        trackingKind: TrackingKind;
        /** The kind of pristines to store */
        pristineKind: PristineKind;
    }

    /**
     * Object tracking kind
     */
    export enum TrackingKind {
        /** Rely on references to track objects */
        Reference = 1,
        /** Rely on hashes to track objects */
        Hash = 2
    }

    /**
     * Object pristine kind
     */
    export enum PristineKind {
        /** Store deep clones in pristines history */
        DeepClone = 0,
        /** Store shallow clones in pristines history */
        ShallowClone = 1
    }

    /**
     * Track changes, save and restore states of tracked objects
     */
    export class State {

        private pristines: Map<Object, Object[]>
        private configuration: IStateConfiguration;

        public static defaultConfiguration: IStateConfiguration = {
            historyDepth: 7,
            trackingKind: TrackingKind.Reference,
            pristineKind: PristineKind.DeepClone
        };

        constructor(configuration?: IStateConfiguration) {

            if (configuration === null) {
                throw new Error("configuration can not be null");
            }

            configuration = configuration || State.defaultConfiguration;

            //check configuration for inconsistencies
            if (configuration.historyDepth < 1) {
                throw new Error("historyDepth could not be less than 1");
            }

            this.pristines = new Map<Object, Object[]>();
            this.configuration = configuration;
        }

        /** Clear all tracked objects and associated states history */
        public clear(): State {
            this.pristines.forEach((value) => {
                value.splice(0, value.length);
            })
            this.pristines.clear();
            return this;
        }

        /** Get the object tracking key that serve as identifier for our pristines history */
        private getTrackingKey(value: Object): any {
            switch (this.configuration.trackingKind) {
                case TrackingKind.Reference:
                    return value;
                case TrackingKind.Hash:
                    return Objs.Types.getHashCode(value);
                default:
                    throw new Error("Unhandled tracking kind");
            }
        }

        private ensureObjectDefinedOrThrow(value: Object): void {
            if (!Objs.Types.isDefined(value)) {
                throw new Error("value is not defined");
            }
            if (Objs.Types.isPrimitive(value)) {
                throw new Error("could not act on a primitive value");
            }
        }

        private getHistory<T>(value: T): T[] {
            const trackingKey = this.getTrackingKey(value);
            if (!this.pristines.has(trackingKey)) {
                return undefined as any as T[];
            }
            return (this.pristines.get(trackingKey) as T[]);
        }

        private getHistoryOrThrow<T>(value: T): T[] {
            const history = this.getHistory(value);
            if (history === undefined) {
                throw new Error("object is not tracked");
            }
            return history;
        }

        private track<T>(value: T): void {
            this.pristines.set(this.getTrackingKey(value), [Objs.Cloner.deepClone(value)]);
        }

        /**
         * Whether or not the given object has changed compared to its previous tracked state
         * @param value : The object to check changed state
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public isChanged(value: Object): boolean {

            this.ensureObjectDefinedOrThrow(value);

            return !Cloner.areClones(value, this.getHistoryOrThrow(value)[0]);
        }

        /**
         * Save the given object state if changes are detected
         * @param value : The object to save state
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public save(value: Object): State {

            this.ensureObjectDefinedOrThrow(value);

            let history = this.getHistory(value);
            if (history === undefined) {
                this.track(value);
                return this;
            }

            if (Cloner.areClones(value, history[0])) {
                return this;
            }

            if (history.length === this.configuration.historyDepth) {
                history.shift();
                history.push(value)
            }
            return this;
        }

        /**
         * Clear the given object states history and considere it in its initial tracking state
         * @param value : The object to clear the related states history
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public reset(value: Object): State {

            this.ensureObjectDefinedOrThrow(value);

            const history = this.getHistoryOrThrow(value);

            history.splice(0, history.length, value);

            return this;
        }

        /**
         * Revert current object states changes
         * @returns the previous object saved state
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public revert<T>(value: T): T {

            this.ensureObjectDefinedOrThrow(value);

            const history = this.getHistoryOrThrow(value);

            if (history.length === 1) {
                return history[0] as T;
            }

            return history.pop() as T;
        }
    }
}