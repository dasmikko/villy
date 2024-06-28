export declare function createClient(opts: any): {
    url: string;
    registerTags: (tags: any, refetch: any) => any;
    unregisterTags: (tagId: any) => void;
    refetchTaggedQueries: (tags: any) => Promise<any>;
};
export declare function resolveClient(): any;
export declare function useClient(opts: any): {
    url: string;
    registerTags: (tags: any, refetch: any) => any;
    unregisterTags: (tagId: any) => void;
    refetchTaggedQueries: (tags: any) => Promise<any>;
};
