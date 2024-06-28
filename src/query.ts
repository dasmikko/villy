import { resolveClient } from './client.js'
import {ref, onBeforeUnmount, onBeforeMount, getCurrentInstance, onMounted, watch, toRaw, isReactive, isRef} from 'vue';
import { noop } from './utils'
import axios from 'axios';




function unravel(obj) {
  if (isRef(obj)) {
    return obj.value
  }

  return obj
}

interface QueryOptions {
    query: string
    fetchOnMount?: boolean
    tags?: string[]
    variables?: Record<string, any>
    onData?: Function
    onError?: Function
    skip?: boolean
    paused?: Function
}

export function useQuery(opts: QueryOptions) {
  const { url, registerTags, unregisterTags } = resolveClient()

  let queryName = opts.query
  let abortController = null
  let currentFetchOnMount = opts.fetchOnMount ?? true

  let data = ref(null)
  let isFetching = ref(false)
  let error = ref(null)
  let paused = opts.paused ?? noop
  let onData = opts.onData ?? noop
  let onError = opts.onError ?? noop
  let skip = opts.skip ?? false


  const vm = getCurrentInstance();
  if (currentFetchOnMount) {
    vm ? onMounted(() => execute()) : execute();
  }

  onBeforeMount(() => {
    if (opts.tags) {
      const id = registerTags(opts.tags, () => {
        execute()
      })

      onBeforeUnmount(() => {
        unregisterTags(id)
      })
    }

    // Reactive variables
    if (opts.variables && isReactive(opts.variables)) {
      watch(opts.variables, () => {
        // Abort previous request if it's still fetching
        if (isFetching.value && abortController) {
          abortController.abort()
        }

        execute()
      })
    }
  })

  const _parseVariablesToFormData = (variables) => {
    let formData = new FormData()

    for (let key in toRaw(variables)) {
      formData.append(key, variables[key])
    }

    return formData
  }


  async function execute() {
    if (unravel(skip)) return
    if (paused(opts.variables)) return

    isFetching.value = true
    error.value = null

    abortController = new AbortController()

    try {
      const response = await axios({
        url: queryName,
        baseURL: url,
        method: 'post',
        signal: abortController.signal,
        withCredentials: true,
        data: _parseVariablesToFormData({...opts.variables}),
      })

      data.value = response.data
      onData(response.data)
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        console.log('Request was canceled')
        return
      }

      console.log(e)
      error.value = e.response.data
      console.log(e.response.data)
      onError(e.response.data)
    }


    isFetching.value = false
  }


  return {
    data,
    error,
    isFetching,
    execute,
  }
}