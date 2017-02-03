namespace Objs {
    /**
     * Utilities for types checks
     */
    export class Types {
        private constructor() { }

        /**
         * Whether or not the given value is not null and not undefined
         */
        public static isDefined(value: any) {
            return value !== undefined && value !== null;
        }

        /**
         * Whether or not the given value is an array
         */
        public static isArray(value: any): boolean {
            return value instanceof Array;
        }

        /**
         * Whether or not the given value is a function 
         */
        public static isFunction(value: any): boolean {
            return typeof value === "function";
        }

        /**
         * Whether or not the given value is a well-known javascript type, i.e. not a custom object
         * This returns true for primitive types, dates, arrays and functions
         */
        public static isNative(value: any): boolean {
            return this.isPrimitive(value) || this.isDate(value) || this.isArray(value) || this.isFunction(value);
        }

        /**
         * Whether or not the given value is a primitive type, including null and undefined
         * This return false for dates and arrays
         */
        public static isPrimitive(value: any): boolean {
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
        public static isDate(value: any): boolean {
            return value instanceof Date;
        }
    }
}