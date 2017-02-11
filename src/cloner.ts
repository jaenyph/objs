/// <reference path="types.ts" />
namespace Objs.Cloning {

    /**
     * Performs shallow cloning of objects
     * Cloning an array, gives a new array full of shallow clones of original items
     */
    export class Cloner {

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

        /**
         * Performs deep cloning of objects
         */
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