import { type tableRecordsSlice } from '@/types/tableRecords'
import { create, type StateCreator } from 'zustand'

export const useSelectedRecordsStore: StateCreator<tableRecordsSlice> = (
  set
) => ({
  singleId: undefined,
  multipleIds: [],

  // Actualiza el ID para editar un solo registro
  setSingleId: (id) => {
    set({ singleId: id })
    // console.log(id)
  },

  // Agrega un ID a la lista de IDs seleccionados (para eliminación o edición múltiple)
  addToSelectedIds: (id) => {
    set((state) => ({
      multipleIds: [...state.multipleIds, id]
    }))
    // console.log(id)
  },

  // Remueve un ID de la lista de seleccionados
  removeFromSelectedIds: (id) => {
    set((state) => ({
      multipleIds: state.multipleIds.filter((selectedId) => selectedId !== id)
    }))
    // console.log(id)
  },

  // Limpia todos los IDs seleccionados, útil después de ejecutar una acción
  clearSelectedIds: () => {
    set({ multipleIds: [] })
  }
  // console.log('clearSelectedId<')
})

export const useSelectedRecords = create<tableRecordsSlice>()((...a) => ({
  ...useSelectedRecordsStore(...a)
}))
