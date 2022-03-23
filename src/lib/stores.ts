import { writable } from 'svelte/store'

interface Data {}

const createDataStore = () => {
  const { subscribe, update, set } = writable<Data>({} as Data)

  return {
    subscribe,
    update,
    set
  }
}

export const data = createDataStore()
