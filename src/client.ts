import uniqueId from 'lodash/uniqueId';

let url = ''
let headers = {}
let axiosOpts = {}
let activeQueryTags = []
let activeClient = null

export function createClient(opts) {
  if (opts) {
    url = opts.url
    headers = {...opts.headers}
    axiosOpts = {...opts.axiosOpts}
  }

  const registerTags = (tags, refetch) => {
    const tagId = uniqueId()
    activeQueryTags.push({id: tagId, tags, refetch })
    return tagId
  }

  const unregisterTags = (tagId) => {
    activeQueryTags = activeQueryTags.filter(tag => tag.id !== tagId)
  }

  const refetchTaggedQueries = (tags) => {
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


export function useClient(opts) {
  const client = createClient(opts)
  if (!activeClient) {
    activeClient = client
  }

  return client
}