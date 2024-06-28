import uniqueId from 'lodash/uniqueId';

let url = ''
let headers = {}
let axiosOpts = {}
let activeQueryTags = []
let activeClient = null


interface ClientOptions {
    url: string
    headers?: Record<string, string>
    axiosOpts?: Record<string, any>
}


export function createClient(opts: ClientOptions) {
  if (opts) {
    url = opts.url
    headers = {...opts.headers}
    axiosOpts = {...opts.axiosOpts}
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