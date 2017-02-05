/// <reference path="types.ts" />
namespace Objs {
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
                    clone[propertyName] = (deepCloning ? this.deepClone(value[propertyName]) : value[propertyName]);
                }
                return clone;
            }
        }

        /**
         * Performs deep cloning of objects
         */
        public static deepClone<T>(value: T): T {
            if (!Objs.Types.isArray(value)) {
                return this.cloneNonArray(value, true);
            }
            else {
                const array = value as any as any[];
                const length = array.length;
                const clone = new Array(array.length);
                for (let index = 0; index < length; ++index) {
                    clone[index] = this.deepClone(array[index]);
                }
                return clone as any as T;
            }
        }

        // private static areSamePrimitives<T>(valueA: T, valueB: T): boolean {
        //     if(valueA === valueB ){
        //         return true;
        //     }
        //     else {
        //         const typeofValueA = typeof valueA;
        //         const typeofValueB = typeof valueB;
        //         if(typeofValueA === "string" && typeofValueA === typeofValueB){
        //             return valueA == valueB;
        //         }
        //         return false;
        //     }
        // }

        public static areClones<T>(valueA: T, valueB: T): boolean {
            if (valueA === valueB || (valueA === undefined && valueB === undefined) || (valueA === null && valueB === null)) {
                return true;
            }
            else {
                // one is null or undefined and not the other
                if (valueA === null || valueA === undefined) {
                    return false;
                }

                if (!Objs.Types.areSameTypes(valueA, valueB)) {
                    return false;
                }

                if (!Objs.Types.isArray(valueA)) {
                    const isNativeValueA = Objs.Types.isNative(valueA);
                    const isNativeValueB = Objs.Types.isNative(valueB);
                    if ((isNativeValueA && isNativeValueB)) {
                        // both native types (not object)
                        // just check against two equals dates here as they reference must be different but their values equal.
                        if (Objs.Types.isDate(valueA) && Objs.Types.isDate(valueB)) {
                            return (valueA as any as Date).getTime() === (valueB as any as Date).getTime();
                        }

                        return false;
                    }

                    // both are objects
                    const keysA = Object.keys(valueA);
                    const keysB = Object.keys(valueB);
                    const keysALength = keysA.length;
                    const keysBLength = keysB.length;

                    if (keysALength !== keysBLength) {
                        return false;
                    }

                    for (let index = 0; index < keysALength; ++index) {
                        const keyA = keysA[index];
                        if (keysB.indexOf(keyA) < 0) {
                            return false;
                        }
                        if (!this.areClones(valueA[keyA], valueB[keyA])) {
                            return false;
                        }
                    }

                    return true;
                }
                else {
                    const arrayA = valueA as any as any[];
                    const arrayB = valueB as any as any[];
                    const arrayALenght = arrayA.length;
                    const arrayBLenght = arrayB.length;

                    if (arrayALenght !== arrayBLenght) {
                        return false;
                    }

                    for (let index = 0; index < arrayALenght; ++index) {
                        if (!this.areClones(arrayA[index], arrayB[index])) {
                            return false;
                        }
                    }

                    return true;
                }
            }
        }
    }
}