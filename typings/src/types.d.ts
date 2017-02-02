declare namespace Objs {
    class Types {
        private constructor();
        static isDefined(value: Object): boolean;
        static isArray(value: Object): boolean;
        static isFunction(value: Object): boolean;
        static isNative(value: Object): boolean;
        static isPrimitive(value: Object): boolean;
        static isDate(value: Object): boolean;
    }
}
