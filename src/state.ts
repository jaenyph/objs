/// <reference path="types.ts" />
namespace Objs {

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
            historyDepth: 1,
            trackingKind: TrackingKind.Reference,
            pristineKind: PristineKind.DeepClone
        };

        constructor(configuration?: IStateConfiguration) {

            if (configuration === null) {
                throw new Error("configuration can not be null");
            }

            this.configuration = configuration || State.defaultConfiguration;
            this.pristines = new Map<Object, Object[]>();

            //check configuration for inconsistencies
            if(this.configuration.historyDepth < 1){
                throw new Error("historyDepth could not be less than 1");
            }
        }

        public reset(): State {
            this.pristines.forEach((value) => {
                value.splice(0, value.length);
            })
            this.pristines.clear();
            return this;
        }

        private getTrackingKey(value:Object):any{
            switch(this.configuration.trackingKind){
                case TrackingKind.Reference:
                    return value;
                case TrackingKind.Hash:
                    return Objs.Types.getHashCode(value);
                default:
                    throw new Error("Unhandled tracking kind");
            }
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

            const trackingKey = this.getTrackingKey(value);
            if(this.pristines.has(trackingKey)){
                throw new Error("object is already tracked");
            }

            this.pristines.set(trackingKey, [Objs.Cloner.deepClone(value)]);

            return this;
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

            const trackingKey = this.getTrackingKey(value);
            if(!this.pristines.has(trackingKey)){
                throw new Error("object is not tracked");
            }

            const pristine = (this.pristines.get(trackingKey) as Object[])[0];

            return !Cloner.areClones(value, pristine);
        }

        /**
         * Save the current object state if any changes occured
         */
        public saveChanges(value:Object) : State {
            if (!Objs.Types.isDefined(value)) {
                throw new Error("value is not defined");
            }
            if (Objs.Types.isPrimitive(value)) {
                throw new Error("could not save changes on a primitive value");
            }

            const trackingKey = this.getTrackingKey(value);
            if(!this.pristines.has(trackingKey)){
                throw new Error("object is not tracked");
            }

            const history = (this.pristines.get(trackingKey) as Object[]);
            if(Cloner.areClones(value, history[0])){
                return this;
            }

            if(history.length === this.configuration.historyDepth){
                history.shift();
                history.push(value)
            }
            return this;
        }

        /**
         * Wipe all saved changes and considere the given object untouched
         */
        public discardChanges(value: Object): State {
            if (!Objs.Types.isDefined(value)) {
                throw new Error("value is not defined");
            }
            if (Objs.Types.isPrimitive(value)) {
                throw new Error("could not detect changes on a primitive value");
            }
            
            const trackingKey = this.getTrackingKey(value);
            if(!this.pristines.has(trackingKey)){
                throw new Error("object is not tracked");
            }

            const history = (this.pristines.get(trackingKey) as Object[]);
            history.splice(0, history.length, value);

            return this;
        }

        /**
         * Revert any changes for the given tracked object and return the pristine version
         * @returns the pristine tracked version
         * @throw "Error" if the given value is not defined or not a complex object (i.e. primitive type);
         */
        public revert<T>(value: T): T {
            if (!Objs.Types.isDefined) {
                throw new Error("value is not defined");
            }
            if (Objs.Types.isPrimitive(value)) {
                throw new Error("could not revert changes on a primitive value");
            }

            const trackingKey = this.getTrackingKey(value);
            if(!this.pristines.has(trackingKey)){
                throw new Error("object is not tracked");
            }

            const history = (this.pristines.get(trackingKey) as Object[]);
            if(history.length === 1){
                return history[0] as T;
            }
            
            return history.pop() as T;
        }
    }
}