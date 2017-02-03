declare namespace Objs {
    class Types {
        private constructor();
        static isDefined(value: any): boolean;
        static isArray(value: any): boolean;
        static isFunction(value: any): boolean;
        static isNative(value: any): boolean;
        static isPrimitive(value: any): boolean;
        static isDate(value: any): boolean;
    }
}
