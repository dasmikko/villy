export declare function useQuery(opts: any): {
    data: import("vue").Ref<any>;
    error: import("vue").Ref<any>;
    isFetching: import("vue").Ref<boolean>;
    execute: () => Promise<void>;
};
