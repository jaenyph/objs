namespace Objs.Comparison {

    /** Options for behaviour of the clone comparison */
    export interface IEquivalenceComparisonOptions {
        /** When implemented, include or exclude properties check */
        isPropertyExcluded?: (propertyName: string, propertyValue: any) => boolean;
        /** Whether or not to ignore missing property in one object if the other one have that property set to undefined */
        ignoreMissingPropertyWhenUndefined?: boolean;
    }


    // interface IEquivalenceComparisonHooks {
    //     onEquals: (valueA: any, valueB: any) => void;
    //     onDifferents: (valueA: any, valueB: any) => void;
    //     onMissingInA: (valueB: any) => void;
    //     onMissingInB: (valueA: any) => void;
    // }

    export interface IComparisonDifferences {
        left: any;
        right: any;
        areEquivalents: boolean,
        missingOnLeft: IComparisonDifferences[];
        missingOnRight: IComparisonDifferences[];
        equivalences: IComparisonDifferences[];
        differences: IComparisonDifferences[];
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

        /** Store any processed references and result to avoid infinite recursion when cycling through references */
        private static storeProcessedReference<T, TResult>(
            valueA: T,
            valueB: T,
            result: TResult,
            processedReferences: Map<Object, Map<Object, TResult>>): void {
            let valueAComparisons: Map<Object, TResult>;
            if (processedReferences.has(valueA)) {
                valueAComparisons = processedReferences.get(valueA) as any as Map<Object, TResult>;
            }
            else {
                valueAComparisons = new Map();
                processedReferences.set(valueA, valueAComparisons);
            }
            valueAComparisons.set(valueB, result);
        }

        /**
            Check for object equivalence with references cycles handling.
            Fast fail if any difference found.
        */
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

        public static compare<T>(
            valueA: T,
            valueB: T,
            comparisonOptions?: IEquivalenceComparisonOptions): IComparisonDifferences {
            const processedReferences = new Map<Object, Map<Object, IComparisonDifferences>>();
            const result = this.checkForDifferences(valueA, valueB, processedReferences, comparisonOptions);
            processedReferences.forEach((entry) => { entry.clear(); });
            processedReferences.clear();
            return result;
        }

        /** Get all the differences between to objects */
        private static checkForDifferences<T>(
            valueA: T,
            valueB: T,
            processedReferences: Map<Object, Map<Object, IComparisonDifferences>>,
            comparisonOptions?: IEquivalenceComparisonOptions)
            : IComparisonDifferences {

            const result: IComparisonDifferences = {
                left: valueA,
                right: valueB,
                areEquivalents: false,
                missingOnLeft: [],
                missingOnRight: [],
                equivalences: [],
                differences: []
            };

            const typeOfValueA:string = typeof valueA;
            // If reference A has already been processed when compared exactly with reference B return the stored result
            if ((typeOfValueA === "object" || typeOfValueA === "array") && processedReferences.has(valueA)) {
                const comparisonsForA = processedReferences.get(valueA) as Map<Object, IComparisonDifferences>;
                if (comparisonsForA.has(valueB)) {
                    return comparisonsForA.get(valueB) as IComparisonDifferences;
                }
            }

            comparisonOptions = comparisonOptions || this.defaultClonesComparisonOptions;
            if (valueA === valueB || (valueA === undefined && valueB === undefined) || (valueA === null && valueB === null)) {
                result.areEquivalents = true;
                return result;
            }
            else {
                // one is null or undefined and not the other
                if (valueA === null || valueA === undefined) {
                    return result;
                }

                if (!Objs.Types.areSameTypes(valueA, valueB)) {
                    return result;
                }

                if (!Objs.Types.isArray(valueA)) {
                    const isNativeValueA = Objs.Types.isNative(valueA);
                    const isNativeValueB = Objs.Types.isNative(valueB);
                    if ((isNativeValueA && isNativeValueB)) {
                        // both native types (not object)
                        // just check against two equals dates here as they reference must be different but their values equal.
                        if (Objs.Types.isDate(valueA) && Objs.Types.isDate(valueB)) {
                            const dateEquals = (valueA as any as Date).getTime() === (valueB as any as Date).getTime();
                            if(dateEquals){
                                result.areEquivalents = true;
                            }
                            return result;
                        }
                        result.areEquivalents = true;
                        return result;
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

                        if (comparisonOptions.ignoreMissingPropertyWhenUndefined) {   
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
                        }

                    }

                    this.storeProcessedReference(valueA, valueB, result, processedReferences);
                    if(!keysBLength && !keysBLength) {
                        //Both objects are empty:
                        result.areEquivalents = true;
                    }

                    for (let index = 0; index < keysALength; ++index) {
                        const keyA = keysA[index];
                        if (keysB.indexOf(keyA) < 0) {
                            result.missingOnRight.push( {
                                left: valueA,
                                right: valueB,
                                missingOnLeft : [],
                                missingOnRight : [],
                                areEquivalents : false,
                                differences : [],
                                equivalences : []
                            } as IComparisonDifferences);
                            //this.storeProcessedReference(valueA, valueB, false, processedReferences);
                            return result;
                        }
                        if (!this.checkForDifferences(valueA[keyA], valueB[keyA], processedReferences, comparisonOptions)) {
                            //this.storeProcessedReference(valueA, valueB, false, processedReferences);
                            return result;
                        }
                    }

                    for (let index = 0; index < keysBLength; ++index) {
                        const keyB = keysB[index];
                        if (keysA.indexOf(keyB) < 0) {
                            result.missingOnLeft.push( {
                                left: valueA,
                                right: valueB,
                                missingOnLeft : [],
                                missingOnRight : [],
                                areEquivalents : false,
                                differences : [],
                                equivalences : []
                            } as IComparisonDifferences);
                            //this.storeProcessedReference(valueA, valueB, false, processedReferences);
                            return result;
                        }
                        if (!this.checkForDifferences(valueB[keyB], valueB[keyB], processedReferences, comparisonOptions)) {
                            //this.storeProcessedReference(valueA, valueB, false, processedReferences);
                            return result;
                        }
                    }

                    return result;
                }
                else {
                    const arrayA = valueA as any as any[];
                    const arrayB = valueB as any as any[];
                    const arrayALenght = arrayA.length;
                    const arrayBLenght = arrayB.length;

                    if (arrayALenght !== arrayBLenght) {
                        return result;
                    }

                    this.storeProcessedReference(valueA, valueB, result, processedReferences);
                    for (let index = 0; index < arrayALenght; ++index) {
                        if (!this.checkForDifferences(arrayA[index], arrayB[index], processedReferences, comparisonOptions)) {
                            result.differences.push({
                                left: valueA,
                                right: valueB,
                                missingOnLeft : [],
                                missingOnRight : [],
                                areEquivalents : false,
                                differences : [],
                                equivalences : []
                            } as IComparisonDifferences);
                            //this.storeProcessedEquivalenceComparison(valueA, valueB, false, processedReferences);
                            return result;
                        }
                    }

                    return result;
                }
            }
        }
    }
}