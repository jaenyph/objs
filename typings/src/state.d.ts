/// <reference path="types.d.ts" />
declare namespace Objs {
    interface IStateConfiguration {
        historyDepth: number;
        trackingKind: StateTrackingKind;
    }
    enum StateTrackingKind {
        Reference = 1,
    }
    class State {
        private pristines;
        private configuration;
        static defaultConfiguration: IStateConfiguration;
        constructor(configuration?: IStateConfiguration);
        reset(): State;
        track(value: Object): State;
        isChanged(value: Object): boolean;
        declarePristine(value: Object): State;
        revert<T>(value: T): T;
    }
}
