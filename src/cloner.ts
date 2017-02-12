/// <reference path="types.ts" />
namespace Objs.Cloning {

    /**
     * Performs shallow cloning of objects
     * Cloning an array, gives a new array full of shallow clones of original items
     */
    export class Cloner {

        private static checkAndPrepareTargetForCloning<T>(source: T, target: T) {
            if (!Objs.Types.isDefined(source)) {
                throw new Error("source is not defined");
            }
            if (!Objs.Types.isDefined(target)) {
                throw new Error("target is not defined");
            }
            if (!Objs.Types.areSameTypes(source, target)) {
                throw new Error("source and target types varies");
            }
            if (Objs.Types.isPrimitive(source)) {
                throw new Error("could not act on a primitive value");
            }
            if (Objs.Types.isPrimitive(target)) {
                throw new Error("could not act on a primitive value");
            }
            if (source === target) {
                throw new Error("could not act on same instances");
            }

            const sourceKeys = Object.keys(source);
            const targetKeys = Object.keys(target);
            targetKeys.forEach(targetKey => {
                if (sourceKeys.indexOf(targetKey) < 0) {
                    delete target[targetKey];
                }
            });
        }

        /**
         * Synchronize the given target with the given source by performing shallow cloning
         * When source and target are arrays the target elements are also shallow-cloned
         * @param source - the object to replicate to the target
         * @param target - the object to be modified to become a clone of the source
         * @returns the synchronized target
         * */
        public static shallowCloneTo<T>(source: T, target: Object): T {
            this.checkAndPrepareTargetForCloning(source, target);

            if (!Objs.Types.isArray(target)) {
                return Object.assign(target, this.shallowClone(source));
            }
            else {
                const targetArray = target as any as any[];
                targetArray.splice(0, targetArray.length);
                const sourceArray = source as any as any[];
                const sourceArrayLength = sourceArray.length;
                for (let index = 0; index < sourceArrayLength; ++index) {
                    targetArray[index] = this.shallowClone(sourceArray[index]);
                }
                return target as T;
            }
        }

        /**
         * Synchronize the given target with the given source by performing deep cloning
         * @param source - the object to replicate to the target
         * @param target - the object to be modified to become a clone of the source
         * @returns the synchronized target
         * */
        public static deepCloneTo<T>(source: T, target: Object): T {
            this.checkAndPrepareTargetForCloning(source, target);

            if (!Objs.Types.isArray(target)) {
                return Object.assign(target, this.deepClone(source));
            }
            else {
                const targetArray = target as any as any[];
                targetArray.splice(0, targetArray.length);
                const sourceArray = source as any as any[];
                const sourceArrayLength = sourceArray.length;
                for (let index = 0; index < sourceArrayLength; ++index) {
                    targetArray[index] = this.deepClone(sourceArray[index]);
                }
                return target as T;
            }
        }

        /** Performs a shallow clone of the given object */
        public static shallowClone<T>(value: T): T {
            if (!Objs.Types.isArray(value)) {
                return this.cloneNonArray(value, false);
            } else {
                const array = value as any as any[];
                const length = array.length;
                const clone = new Array(array.length);
                for (let index = 0; index < length; ++index) {
                    const element = array[index];
                    if (!Objs.Types.isArray) {
                        clone[index] = this.cloneNonArray(element, false);
                    }
                    else {
                        //just construct a new array with the original elements
                        clone[index] = new Array(element as any as any[]);
                    }
                }
                return clone as any as T;
            }
        }

        private static cloneNonArray(value: Object, deepCloning: boolean): any {
            if (Objs.Types.isPrimitive(value)) {
                switch (typeof value) {
                    case "string":
                        return (value !== undefined && value !== null)
                            ? "" + value
                            : value;
                    default:
                        return value;
                }
            }
            else if (Objs.Types.isFunction(value)) {
                return value;
            }
            else if (Objs.Types.isDate(value)) {
                return new Date((value as Date).getTime());
            }
            else {
                // this is a complex type:
                const clone = Object.create(value);
                for (const propertyName in value) {
                    if (value.hasOwnProperty(propertyName)) {
                        clone[propertyName] = (deepCloning ? this.deepClone(value[propertyName]) : value[propertyName]);
                    }
                }
                return clone;
            }
        }

        /** Performs a deep clone of the given object */
        public static deepClone<T>(value: T): T {
            //return this.deepCloneStraight(value);
            const processedReferences = new Map<Object, any>();
            const clone = this.deepCloneWithCyclesHandling(value, processedReferences);
            processedReferences.clear();
            return clone;
        }

        /** Deep cloning with cycles handling */
        private static deepCloneWithCyclesHandling<T>(value: T, processedReferences: Map<Object, any>): T {
            const typeOfValue = typeof value;
            if ((typeOfValue === "object" || typeOfValue === "array") && processedReferences.has(value)) {
                return processedReferences.get(value);
            }

            if (!Objs.Types.isArray(value)) {
                return this.cloneNonArrayWithCyclesHandling(value, true, processedReferences);
            }
            else {
                const array = value as any as any[];
                const length = array.length;
                const clone: any[] = [];
                processedReferences.set(value, clone);
                for (let index = 0; index < length; ++index) {
                    clone[index] = this.deepCloneWithCyclesHandling(array[index], processedReferences);
                }
                return clone as any as T;
            }
        }

        private static cloneNonArrayWithCyclesHandling(value: Object, deepCloning: boolean, processedReferences: Map<Object, any>): any {
            if (Objs.Types.isPrimitive(value)) {
                switch (typeof value) {
                    case "string":
                        return (value !== undefined && value !== null)
                            ? "" + value
                            : value;
                    default:
                        return value;
                }
            }
            else if (Objs.Types.isFunction(value)) {
                return value;
            }
            else {

                if (processedReferences.has(value)) {
                    return processedReferences.get(value);
                }

                if (Objs.Types.isDate(value)) {
                    const clone = new Date((value as Date).getTime());
                    processedReferences.set(value, clone);
                    return clone;
                }

                // this is a complex type:
                const clone = Object.create(value);
                processedReferences.set(value, clone);
                for (const propertyName in value) {
                    if (value.hasOwnProperty(propertyName)) {
                        clone[propertyName] = (deepCloning ? this.deepCloneWithCyclesHandling(value[propertyName], processedReferences) : value[propertyName]);
                    }
                }
                return clone;
            }
        }
    }
}