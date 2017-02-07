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

        private static assignTo<T>(target: T, source: Object): T {
            const targetKeys = Object.keys(target);
            const sourceKeys = Object.keys(source);
            targetKeys.forEach((key) => {
                if (sourceKeys.indexOf(key) < 0) {
                    delete target[key];
                }
            });

            return Object.assign(target, source);
        }

        private static ensurekSyncableOrThrow<T>(target: T, source: Object): void {
            if (!Objs.Types.isDefined(target)) {
                throw new Error("target is not defined");
            }

            if (!Objs.Types.isDefined(source)) {
                throw new Error("source is not defined");
            }

            if (Objs.Types.isPrimitive(target) || Objs.Types.isPrimitive(source)) {
                throw new Error("could not act on primitive");
            }

            if (typeof target !== typeof source) {
                throw new Error("source and target types must match");
            }
        }

        public static shallowCloneTo<T>(target: T, source: Object): T {
            this.ensurekSyncableOrThrow(target, source);
            return this.assignTo(target, source);
        }

        public static deepCloneTo<T>(target: T, source: Object): T {
            this.ensurekSyncableOrThrow(target, source);
            return this.assignTo(target, this.deepClone(source));
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
    }
}