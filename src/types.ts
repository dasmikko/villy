import {AxiosRequestConfig} from "axios";

export interface ClientOptions {
    url: string
    axiosConfig?: AxiosRequestConfig
}


export interface QueryOptions {
    query: string
    fetchOnMount?: boolean
    tags?: string[]
    variables?: Record<string, any>
    onData?: Function
    onError?: Function
    skip?: boolean
    paused?: Function
}

export interface MutationOptions {
    mutation: string
    refetchTags?: string[]
    onData?: Function
    onError?: Function
}


