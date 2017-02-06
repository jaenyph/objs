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
        /** The kind of casing to use when accessing tracked objects properties names */
        propertyNameCasingKind: PropertyNameCasingKind;
    }

    /** Object tracking kind */
    export enum TrackingKind {
        /** Rely on references for tracking */
        Reference = 1,
        /** Rely on object's id property for tracking */
        Id = 2
    }

    /** Object pristine kind */
    export enum PristineKind {
        /** Store deep clones in pristines history */
        DeepClone = 0,
        /** Store shallow clones in pristines history */
        ShallowClone = 1
    }

    /** The casing scheme used for tracked objects properties names  */
    export enum PropertyNameCasingKind {
        LowerCamelCase = 0,
        UpperCamelCase = 1
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
            pristineKind: PristineKind.DeepClone,
            propertyNameCasingKind: PropertyNameCasingKind.LowerCamelCase
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
                case TrackingKind.Id:
                    return value[this.getCasedIdPropertyName()];
                default:
                    throw new Error("unhandled tracking kind");
            }
        }

        private ensureObjectDefinedOrThrow(value: Object): void {
            if (!Objs.Types.isDefined(value)) {
                throw new Error("value is not defined");
            }
            if (this.configuration.trackingKind === Objs.TrackingKind.Id) {
                if (!value.hasOwnProperty(this.getCasedIdPropertyName())) {
                    throw new Error(`value does not defined an '${this.getCasedIdPropertyName()}' key`);
                }
                value.isPrototypeOf
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

        /**
         * Whether or not the given object has changed compared to its previous tracked state
         * @param value : The object to check changed state
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public isChanged(value: Object): boolean {

            this.ensureObjectDefinedOrThrow(value);

            return !Cloner.areClones(value, this.getHistoryOrThrow(value)[0]);
        }

        private clone<T>(value: T): T {
            switch (this.configuration.pristineKind) {
                case PristineKind.DeepClone:
                    return Cloner.deepClone(value);
                case PristineKind.ShallowClone:
                    return Cloner.shallowClone(value);
                default:
                    throw new Error("unhandled pristine kind");
            }
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
                this.pristines.set(this.getTrackingKey(value), [this.clone(value)]);
                return this;
            }

            if (Cloner.areClones(value, history[0])) {
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
         * Peek the last object state in history without reverting it
         * @param value : The object to peek the last saved state
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public peek<T>(value: T): T {

            this.ensureObjectDefinedOrThrow(value);

            const history = this.getHistoryOrThrow(value);

            if (history.length === 0) {
                throw new Error("object state could not be peeked");
            }

            return history[0] as T;
        }

        /**
         * Revert current object states changes
         * @returns the previous object saved state
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public revert<T>(value: T): T {

            this.ensureObjectDefinedOrThrow(value);

            const history = this.getHistoryOrThrow(value);

            if (history.length === 0) {
                throw new Error("object could not be more reverted");
            }

            return history.shift() as T;
        }
    }
}