/// <reference path="types.ts" />
namespace Objs {

    export interface IStateConfiguration {
        historyDepth: number;
        trackingKind: StateTrackingKind;
    }

    export enum StateTrackingKind {
        Reference = 1
    }

    /**

/**
 * Track changes, save and restore states of tracked objects
 */
    export class State {

        private pristines: Map<Object, Object[]>
        private configuration: IStateConfiguration;

        public static defaultConfiguration: IStateConfiguration = {
            historyDepth: 1,
            trackingKind: StateTrackingKind.Reference
        };

        constructor(configuration?: IStateConfiguration) {

            if (configuration === null) {
                throw new Error("configuration can not be null");
            }

            this.configuration = configuration || State.defaultConfiguration;
            this.pristines = new Map<Object, Object[]>();
        }

        public reset(): State {
            this.pristines.forEach((value) => {
                value.splice(0, value.length);
            })
            this.pristines.clear();
            return this;
        }

        /**
         * Activate state tracking on the given object
         */
        public track(value: Object): State {
            if (!Objs.Types.isDefined(value)) {
                throw new Error("value is not defined");
            }
            if (Objs.Types.isPrimitive(value)) {
                throw new Error("could not detect changes on a primitive value");
            }

            // TODO: check whether or not we can accept null/undefined
            // references here that would be initialized later

            throw new Error("Not implemented");
        }

        /**
         * Whether or not the given object has changed compared to its previous tracked state
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public isChanged(value: Object): boolean {
            if (!Objs.Types.isDefined(value)) {
                throw new Error("value is not defined");
            }
            if (Objs.Types.isPrimitive(value)) {
                throw new Error("could not detect changes on a primitive value");
            }

            throw new Error("Not implemented");
        }

        /**
         * Wipe all tracked changes and considere the given object to be pristine
         */
        public declarePristine(value: Object): State {
            if (!Objs.Types.isDefined(value)) {
                throw new Error("value is not defined");
            }
            if (Objs.Types.isPrimitive(value)) {
                throw new Error("could not detect changes on a primitive value");
            }
            
            throw new Error("Not implemented");
        }

        /**
         * Revert any changes on the given object
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public revert<T>(value: T): T {
            if (!Objs.Types.isDefined) {
                throw new Error("value is not defined");
            }
            if (Objs.Types.isPrimitive(value)) {
                throw new Error("could not revert changes on a primitive value");
            }

            throw new Error("Not implemented");
        }
    }
}