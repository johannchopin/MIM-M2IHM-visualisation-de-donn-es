import { writable } from 'svelte/store'

export enum EntrepriseHeader {
  ID,
  SA,
  REGION,
  TAILLE,
  CA,
  FONCTION
}
interface Data {
  entreprises: {[ key in EntrepriseHeader]: string}[]
  answers: string[][]
  categories: [string, string][]
}

const createDataStore = () => {
  const { subscribe, update, set } = writable<Data>({} as Data)

  return {
    subscribe,
    update,
    set
  }
}

export const data = createDataStore()
