namespace Objs.Comparison {

    /** Options for behaviour of the clone comparison */
    export interface IEquivalenceComparisonOptions {
        /** When implemented, include or exclude properties check */
        isPropertyExcluded?: (propertyName: string, propertyValue: any) => boolean;
        /** Whether or not to ignore missing property in one object if the other one have that property set to undefined */
        ignoreMissingPropertyWhenUndefined?: boolean;
    }

    export class Comparer {

        private static defaultClonesComparisonOptions: IEquivalenceComparisonOptions = {
            isPropertyExcluded: undefined,
            ignoreMissingPropertyWhenUndefined: false
        };

        /** Check whether or not two object could be considered equivalent */
        public static areEquivalent<T>(
            valueA: T,
            valueB: T,
            comparisonOptions?: IEquivalenceComparisonOptions): boolean {

            const processedReferences = new Map<Object, Map<Object, boolean>>();
            const result = this.checkForEquivalence(valueA, valueB, processedReferences, comparisonOptions);
            processedReferences.forEach((entry) => { entry.clear(); });
            processedReferences.clear();
            return result;
        }

        /** Store any processed references and result to avoid infinite recursion when cycling through references */
        private static storeProcessedEquivalenceComparison<T>(
            valueA: T,
            valueB: T,
            isEquivalent: boolean,
            processedReferences: Map<Object, Map<Object, boolean>>): void {
            let valueAComparisons: Map<Object, boolean>;
            if (processedReferences.has(valueA)) {
                valueAComparisons = processedReferences.get(valueA) as any as Map<Object, boolean>;
            }
            else {
                valueAComparisons = new Map();
                processedReferences.set(valueA, valueAComparisons);
            }
            valueAComparisons.set(valueB, isEquivalent);
        }

        /** Check for object equivalence with references cycles handling */
        private static checkForEquivalence<T>(
            valueA: T,
            valueB: T,
            processedReferences: Map<Object, Map<Object, boolean>>,
            comparisonOptions?: IEquivalenceComparisonOptions)
            : boolean {

            const typeOfValueA : string = typeof valueA;
            if ((typeOfValueA === "object" || typeOfValueA === "array") && processedReferences.has(valueA)) {
                const comparisonsForA = processedReferences.get(valueA) as Map<Object, boolean>;
                if (comparisonsForA.has(valueB)) {
                    return comparisonsForA.get(valueB) as boolean;
                }
            }

            comparisonOptions = comparisonOptions || this.defaultClonesComparisonOptions;
            if (valueA === valueB || (valueA === undefined && valueB === undefined) || (valueA === null && valueB === null)) {
                return true;
            }
            else {
                // one is null or undefined and not the other
                if (valueA === null || valueA === undefined) {
                    return false;
                }

                if (valueB === null || valueB === undefined) {
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
                    const checkPropertyExclusion = comparisonOptions.isPropertyExcluded;
                    let keysA: string[] = checkPropertyExclusion
                        ? Object.keys(valueA).filter((key) => { return !checkPropertyExclusion(key, valueA[key]); })
                        : Object.keys(valueA);
                    let keysB: string[] = checkPropertyExclusion
                        ? Object.keys(valueB).filter((key) => { return !checkPropertyExclusion(key, valueB[key]); })
                        : Object.keys(valueB);

                    let keysALength = keysA.length;
                    let keysBLength = keysB.length;

                    if (keysALength !== keysBLength) {

                        if (!comparisonOptions.ignoreMissingPropertyWhenUndefined) {
                            return false;
                        }

                        //also discard undefined properties when the same property is not defined on the other side
                        keysA = keysA.filter((key) => {
                            if (valueA[key] === undefined) {
                                return valueB.hasOwnProperty(key);
                            }
                            return true;
                        });
                        keysB = keysB.filter((key) => {
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
                    for (let index = 0; index < keysALength; ++index) {
                        const keyA = keysA[index];
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
                    const arrayA = valueA as any as any[];
                    const arrayB = valueB as any as any[];
                    const arrayALenght = arrayA.length;
                    const arrayBLenght = arrayB.length;

                    if (arrayALenght !== arrayBLenght) {
                        return false;
                    }

                    this.storeProcessedEquivalenceComparison(valueA, valueB, true, processedReferences);
                    for (let index = 0; index < arrayALenght; ++index) {
                        if (!this.checkForEquivalence(arrayA[index], arrayB[index], processedReferences, comparisonOptions)) {
                            this.storeProcessedEquivalenceComparison(valueA, valueB, false, processedReferences);
                            return false;
                        }
                    }

                    return true;
                }
            }
        }
    }
}