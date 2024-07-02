import uniqueId from 'lodash/uniqueId';
import {AxiosRequestConfig} from "axios";
import { ClientOptions } from './types'


let url: string = ''
let axiosConfig: AxiosRequestConfig = {}
let activeQueryTags = []
let activeClient = null


export function createClient(opts: ClientOptions) {
  if (opts) {
    url = opts.url
    axiosConfig = {...opts.axiosConfig}
  }

  const registerTags = (tags: string[], refetch: Function) => {
    const tagId = uniqueId()
    activeQueryTags.push({id: tagId, tags, refetch })
    return tagId
  }

  const unregisterTags = (tagId: number) => {
    activeQueryTags = activeQueryTags.filter(tag => tag.id !== tagId)
  }

  const refetchTaggedQueries = (tags: string[]) => {
    const queries = activeQueryTags.filter(tq => {
      return tq.tags.some(t => tags.includes(t));
    });

    return Promise.all(queries.map(q => q.refetch())).then(() => undefined)
  }

  return {
    url,
    registerTags,
    unregisterTags,
    refetchTaggedQueries
  }
}

export function resolveClient() {
  if (!activeClient) {
    throw new Error("No client has been set")
  }

  return activeClient
}


export function useClient(opts: ClientOptions) {
  const client = createClient(opts)
  if (!activeClient) {
    activeClient = client
  }

  return client
}

export default useClient;