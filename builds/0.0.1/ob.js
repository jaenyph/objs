"use strict";
var Objs;
(function (Objs) {
    var Types = (function () {
        function Types() {
        }
        Types.isDefined = function (value) {
            return value !== undefined && value !== null;
        };
        Types.isArray = function (value) {
            return value instanceof Array;
        };
        Types.isFunction = function (value) {
            return typeof value === "function";
        };
        Types.isNative = function (value) {
            return this.isPrimitive(value) || this.isDate(value) || this.isArray(value) || this.isFunction(value);
        };
        Types.isPrimitive = function (value) {
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
        };
        Types.isDate = function (value) {
            return value instanceof Date;
        };
        Types.areSameTypes = function (valueA, valueB) {
            return typeof valueA === typeof valueB;
        };
        Types.getHashCode = function (value) {
            return this.getStringHashCode(typeof value === "string" ? value : JSON.stringify(value, undefined, 0));
        };
        Types.getStringHashCode = function (value) {
            var length = value.length;
            if (length === 0)
                return 0;
            var hash = 0, i, chr;
            for (i = 0; i < length; i++) {
                chr = value.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return hash;
        };
        return Types;
    }());
    Objs.Types = Types;
})(Objs || (Objs = {}));
"use strict";
var Objs;
(function (Objs) {
    var Cloning;
    (function (Cloning) {
        var Cloner = (function () {
            function Cloner() {
            }
            Cloner.shallowClone = function (value) {
                if (!Objs.Types.isArray(value)) {
                    return this.cloneNonArray(value, false);
                }
                else {
                    var array = value;
                    var length_1 = array.length;
                    var clone = new Array(array.length);
                    for (var index = 0; index < length_1; ++index) {
                        var element = array[index];
                        if (!Objs.Types.isArray) {
                            clone[index] = this.cloneNonArray(element, false);
                        }
                        else {
                            clone[index] = new Array(element);
                        }
                    }
                    return clone;
                }
            };
            Cloner.cloneNonArray = function (value, deepCloning) {
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
                    return new Date(value.getTime());
                }
                else {
                    var clone = Object.create(value);
                    for (var propertyName in value) {
                        if (value.hasOwnProperty(propertyName)) {
                            clone[propertyName] = (deepCloning ? this.deepClone(value[propertyName]) : value[propertyName]);
                        }
                    }
                    return clone;
                }
            };
            Cloner.deepClone = function (value) {
                var processedReferences = new Map();
                var clone = this.deepCloneWithCyclesHandling(value, processedReferences);
                processedReferences.clear();
                return clone;
            };
            Cloner.deepCloneWithCyclesHandling = function (value, processedReferences) {
                var typeOfValue = typeof value;
                if ((typeOfValue === "object" || typeOfValue === "array") && processedReferences.has(value)) {
                    return processedReferences.get(value);
                }
                if (!Objs.Types.isArray(value)) {
                    return this.cloneNonArrayWithCyclesHandling(value, true, processedReferences);
                }
                else {
                    var array = value;
                    var length_2 = array.length;
                    var clone = [];
                    processedReferences.set(value, clone);
                    for (var index = 0; index < length_2; ++index) {
                        clone[index] = this.deepCloneWithCyclesHandling(array[index], processedReferences);
                    }
                    return clone;
                }
            };
            Cloner.cloneNonArrayWithCyclesHandling = function (value, deepCloning, processedReferences) {
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
                        var clone_1 = new Date(value.getTime());
                        processedReferences.set(value, clone_1);
                        return clone_1;
                    }
                    var clone = Object.create(value);
                    processedReferences.set(value, clone);
                    for (var propertyName in value) {
                        if (value.hasOwnProperty(propertyName)) {
                            clone[propertyName] = (deepCloning ? this.deepCloneWithCyclesHandling(value[propertyName], processedReferences) : value[propertyName]);
                        }
                    }
                    return clone;
                }
            };
            return Cloner;
        }());
        Cloning.Cloner = Cloner;
    })(Cloning = Objs.Cloning || (Objs.Cloning = {}));
})(Objs || (Objs = {}));
"use strict";
var Objs;
(function (Objs) {
    var Comparison;
    (function (Comparison) {
        var Comparer = (function () {
            function Comparer() {
            }
            Comparer.areEquivalent = function (valueA, valueB, comparisonOptions) {
                var processedReferences = new Map();
                var result = this.checkForEquivalence(valueA, valueB, processedReferences, comparisonOptions);
                processedReferences.forEach(function (entry) { entry.clear(); });
                processedReferences.clear();
                return result;
            };
            Comparer.storeProcessedEquivalenceComparison = function (valueA, valueB, isEquivalent, processedReferences) {
                var valueAComparisons;
                if (processedReferences.has(valueA)) {
                    valueAComparisons = processedReferences.get(valueA);
                }
                else {
                    valueAComparisons = new Map();
                    processedReferences.set(valueA, valueAComparisons);
                }
                valueAComparisons.set(valueB, isEquivalent);
            };
            Comparer.checkForEquivalence = function (valueA, valueB, processedReferences, comparisonOptions) {
                var typeOfValueA = typeof valueA;
                if ((typeOfValueA === "object" || typeOfValueA === "array") && processedReferences.has(valueA)) {
                    var comparisonsForA = processedReferences.get(valueA);
                    if (comparisonsForA.has(valueB)) {
                        return comparisonsForA.get(valueB);
                    }
                }
                comparisonOptions = comparisonOptions || this.defaultClonesComparisonOptions;
                if (valueA === valueB || (valueA === undefined && valueB === undefined) || (valueA === null && valueB === null)) {
                    return true;
                }
                else {
                    if (valueA === null || valueA === undefined) {
                        return false;
                    }
                    if (!Objs.Types.areSameTypes(valueA, valueB)) {
                        return false;
                    }
                    if (!Objs.Types.isArray(valueA)) {
                        var isNativeValueA = Objs.Types.isNative(valueA);
                        var isNativeValueB = Objs.Types.isNative(valueB);
                        if ((isNativeValueA && isNativeValueB)) {
                            if (Objs.Types.isDate(valueA) && Objs.Types.isDate(valueB)) {
                                return valueA.getTime() === valueB.getTime();
                            }
                            return false;
                        }
                        var checkPropertyExclusion_1 = comparisonOptions.isPropertyExcluded;
                        var keysA = checkPropertyExclusion_1
                            ? Object.keys(valueA).filter(function (key) { return !checkPropertyExclusion_1(key, valueA[key]); })
                            : Object.keys(valueA);
                        var keysB = checkPropertyExclusion_1
                            ? Object.keys(valueB).filter(function (key) { return !checkPropertyExclusion_1(key, valueB[key]); })
                            : Object.keys(valueB);
                        var keysALength = keysA.length;
                        var keysBLength = keysB.length;
                        if (keysALength !== keysBLength) {
                            if (!comparisonOptions.ignoreMissingPropertyWhenUndefined) {
                                return false;
                            }
                            keysA = keysA.filter(function (key) {
                                if (valueA[key] === undefined) {
                                    return valueB.hasOwnProperty(key);
                                }
                                return true;
                            });
                            keysB = keysB.filter(function (key) {
                                if (valueB[key] === undefined) {
                                    return valueA.hasOwnProperty(key);
                                }
                                return true;
                            });
                            keysALength = keysA.length;
                            keysBLength = keysB.length;
                            if (keysALength !== keysBLength) {
                                return false;
                            }
                        }
                        this.storeProcessedEquivalenceComparison(valueA, valueB, true, processedReferences);
                        for (var index = 0; index < keysALength; ++index) {
                            var keyA = keysA[index];
                            if (keysB.indexOf(keyA) < 0) {
                                this.storeProcessedEquivalenceComparison(valueA, valueB, false, processedReferences);
                                return false;
                            }
                            if (!this.checkForEquivalence(valueA[keyA], valueB[keyA], processedReferences, comparisonOptions)) {
                                this.storeProcessedEquivalenceComparison(valueA, valueB, false, processedReferences);
                                return false;
                            }
                        }
                        return true;
                    }
                    else {
                        var arrayA = valueA;
                        var arrayB = valueB;
                        var arrayALenght = arrayA.length;
                        var arrayBLenght = arrayB.length;
                        if (arrayALenght !== arrayBLenght) {
                            return false;
                        }
                        this.storeProcessedEquivalenceComparison(valueA, valueB, true, processedReferences);
                        for (var index = 0; index < arrayALenght; ++index) {
                            if (!this.checkForEquivalence(arrayA[index], arrayB[index], processedReferences, comparisonOptions)) {
                                this.storeProcessedEquivalenceComparison(valueA, valueB, false, processedReferences);
                                return false;
                            }
                        }
                        return true;
                    }
                }
            };
            return Comparer;
        }());
        Comparer.defaultClonesComparisonOptions = {
            isPropertyExcluded: undefined,
            ignoreMissingPropertyWhenUndefined: false
        };
        Comparison.Comparer = Comparer;
    })(Comparison = Objs.Comparison || (Objs.Comparison = {}));
})(Objs || (Objs = {}));
"use strict";
var Objs;
(function (Objs) {
    var Snapshots;
    (function (Snapshots) {
        var IdentificationKind;
        (function (IdentificationKind) {
            IdentificationKind[IdentificationKind["Reference"] = 1] = "Reference";
            IdentificationKind[IdentificationKind["Id"] = 2] = "Id";
        })(IdentificationKind = Snapshots.IdentificationKind || (Snapshots.IdentificationKind = {}));
        var SnapshotKind;
        (function (SnapshotKind) {
            SnapshotKind[SnapshotKind["DeepClone"] = 0] = "DeepClone";
            SnapshotKind[SnapshotKind["ShallowClone"] = 1] = "ShallowClone";
        })(SnapshotKind = Snapshots.SnapshotKind || (Snapshots.SnapshotKind = {}));
        var PropertyNameCasingKind;
        (function (PropertyNameCasingKind) {
            PropertyNameCasingKind[PropertyNameCasingKind["LowerCamelCase"] = 0] = "LowerCamelCase";
            PropertyNameCasingKind[PropertyNameCasingKind["UpperCamelCase"] = 1] = "UpperCamelCase";
        })(PropertyNameCasingKind = Snapshots.PropertyNameCasingKind || (Snapshots.PropertyNameCasingKind = {}));
        var Snapshotter = (function () {
            function Snapshotter(configuration) {
                if (configuration === null) {
                    throw new Error("configuration can not be null");
                }
                configuration = configuration || Snapshotter.defaultConfiguration;
                if (configuration.historyDepth < 1) {
                    throw new Error("historyDepth could not be less than 1");
                }
                this.snapshots = new Map();
                this.configuration = configuration;
            }
            Snapshotter.prototype.getCasedIdPropertyName = function () {
                switch (this.configuration.propertyNameCasingKind) {
                    case PropertyNameCasingKind.LowerCamelCase:
                        return "id";
                    case PropertyNameCasingKind.UpperCamelCase:
                        return "Id";
                    default:
                        throw new Error("unsupported casing");
                }
            };
            Snapshotter.prototype.clearAll = function () {
                this.snapshots.forEach(function (history) {
                    history.splice(0, history.length);
                });
                this.snapshots.clear();
                return this;
            };
            Snapshotter.prototype.getIdentifier = function (value) {
                switch (this.configuration.identificationKind) {
                    case IdentificationKind.Reference:
                        return value;
                    case IdentificationKind.Id:
                        return value[this.getCasedIdPropertyName()];
                    default:
                        throw new Error("unhandled identification kind");
                }
            };
            Snapshotter.prototype.ensureObjectDefinedOrThrow = function (value) {
                if (!Objs.Types.isDefined(value)) {
                    throw new Error("value is not defined");
                }
                if (this.configuration.identificationKind === Objs.Snapshots.IdentificationKind.Id) {
                    if (!value.hasOwnProperty(this.getCasedIdPropertyName())) {
                        throw new Error("value does not defined an '" + this.getCasedIdPropertyName() + "' property");
                    }
                    value.isPrototypeOf;
                }
                if (Objs.Types.isPrimitive(value)) {
                    throw new Error("could not act on a primitive value");
                }
            };
            Snapshotter.prototype.getHistory = function (value) {
                var trackingKey = this.getIdentifier(value);
                if (!this.snapshots.has(trackingKey)) {
                    return undefined;
                }
                return this.snapshots.get(trackingKey);
            };
            Snapshotter.prototype.getHistoryOrThrow = function (value) {
                var history = this.getHistory(value);
                if (history === undefined) {
                    throw new Error("value has no snapshots");
                }
                return history;
            };
            Snapshotter.prototype.isChanged = function (value, comparisonOptions) {
                this.ensureObjectDefinedOrThrow(value);
                return !Objs.Comparison.Comparer.areEquivalent(value, this.getHistoryOrThrow(value)[0], comparisonOptions);
            };
            Snapshotter.prototype.clone = function (value) {
                switch (this.configuration.snapshotKind) {
                    case SnapshotKind.DeepClone:
                        return Objs.Cloning.Cloner.deepClone(value);
                    case SnapshotKind.ShallowClone:
                        return Objs.Cloning.Cloner.shallowClone(value);
                    default:
                        throw new Error("unhandled snapshot kind");
                }
            };
            Snapshotter.prototype.save = function (value) {
                this.ensureObjectDefinedOrThrow(value);
                var history = this.getHistory(value);
                if (history === undefined) {
                    this.snapshots.set(this.getIdentifier(value), [this.clone(value)]);
                    return this;
                }
                if (Objs.Comparison.Comparer.areEquivalent(value, history[0])) {
                    return this;
                }
                var clone = this.clone(value);
                var historyLenght = history.unshift(clone);
                if (historyLenght > this.configuration.historyDepth) {
                    history.pop();
                }
                return this;
            };
            Snapshotter.prototype.clear = function (value) {
                this.ensureObjectDefinedOrThrow(value);
                var history = this.getHistoryOrThrow(value);
                history.splice(0, history.length, this.clone(value));
                return this;
            };
            Snapshotter.prototype.peek = function (value) {
                this.ensureObjectDefinedOrThrow(value);
                var history = this.getHistoryOrThrow(value);
                if (history.length === 0) {
                    throw new Error("snapshot could not be peeked");
                }
                return history[0];
            };
            Snapshotter.prototype.revert = function (value) {
                this.ensureObjectDefinedOrThrow(value);
                var history = this.getHistoryOrThrow(value);
                if (history.length === 0) {
                    throw new Error("value could not be more reverted");
                }
                return history.shift();
            };
            return Snapshotter;
        }());
        Snapshotter.defaultConfiguration = {
            historyDepth: 7,
            identificationKind: IdentificationKind.Reference,
            snapshotKind: SnapshotKind.DeepClone,
            propertyNameCasingKind: PropertyNameCasingKind.LowerCamelCase
        };
        Snapshots.Snapshotter = Snapshotter;
    })(Snapshots = Objs.Snapshots || (Objs.Snapshots = {}));
})(Objs || (Objs = {}));
//# sourceMappingURL=ob.js.map