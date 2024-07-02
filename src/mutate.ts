import { resolveClient } from './client.js'
import {ref, onBeforeMount } from 'vue';
import axios from 'axios';
import { noop } from './utils'
import { MutationOptions } from './types'

export function useMutation(path, opts: MutationOptions) {
  const { url, refetchTaggedQueries } = resolveClient()

  let mutationPath = path
  let tagsToRefetch = opts.refetchTags ?? []

  let data = ref(null)
  let isFetching = ref(false)
  let error = ref(null)
  let onData = opts.onData ?? noop
  let onError = opts.onError ?? noop

  onBeforeMount(() => {
    if (!path) {
      throw new Error("No path was provided")
    }
  })

  const _parseVariablesToFormData = (variables) => {
    let formData = new FormData()

    for (let key in variables) {
      formData.append(key, variables[key])
    }

    return formData
  }


  async function execute(variables) {
    isFetching.value = true
    error.value = null

    try {
      const response = await axios({
        url: mutationPath,
        baseURL: url,
        method: 'post',
        withCredentials: true,
        data: _parseVariablesToFormData({...variables}),
      })

      data.value = response.data
      onData(response.data)

      if (tagsToRefetch.length) await refetchTaggedQueries(tagsToRefetch)
    } catch (e) {
      console.error(e)
      error.value = e.response.data
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