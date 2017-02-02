/// <reference path="types.d.ts" />
declare namespace Objs {
    class Cloner {
        static shallowClone<T>(value: T): T;
        private static cloneNonArray(value, deepCloning);
        static deepClone<T>(value: T): T;
    }
}
