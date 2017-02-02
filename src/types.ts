namespace Objs {
    /**
     * Utilities for types checks
     */
    export class Types {
        private constructor() { }

        /**
         * Whether or not the given value is not null and not undefined
         */
        public static isDefined(value: Object) {
            return value !== undefined && value !== null;
        }

        /**
         * Whether or not the given value is an array
         */
        public static isArray(value: Object): boolean {
            return typeof value === "array";
        }

        /**
         * Whether or not the given value is a function 
         */
        public static isFunction(value: Object): boolean {
            return typeof value === "function";
        }

        /**
         * Whether or not the given value is a well-known javascript type, i.e. not a custom object
         * This returns true for primitive types, dates, arrays and functions
         */
        public static isNative(value: Object): boolean {
            return this.isPrimitive(value) || this.isDate(value) || this.isArray(value) || this.isFunction(value);
        }

        /**
         * Whether or not the given value is a primitive type, including null and undefined
         * This return false for dates and arrays
         */
        public static isPrimitive(value: Object): boolean {
            if (value === undefined || value === null) {
                return true;
            }
            switch (typeof value) {
                case "string":
                case "number":
                case "boolean":
                    return true;
            }
            return false;
        }

        /**
         * Whether or not the given value is a date
         */
        public static isDate(value: Object): boolean {
            return value instanceof Date;
        }
    }
}