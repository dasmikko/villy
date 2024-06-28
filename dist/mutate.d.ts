export declare function useMutation(mutation: any, opts?: {}): {
    data: import("vue").Ref<any>;
    error: import("vue").Ref<any>;
    isFetching: import("vue").Ref<boolean>;
    execute: (variables: any) => Promise<void>;
};
