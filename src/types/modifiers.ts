import { Category } from './categories'

export interface ModifierSlice {
  loading: boolean
  modifiers: Modifier[]
  activeModifier: Modifier | null
  saveModifier: (modifier: ModifierInputs) => Promise<boolean>
  updateModifier: (modifier: ModifierInputs, id: number) => Promise<void>
  deleteModifier: (id: number) => Promise<void>
  getModifiers: () => Promise<void>
  setActiveModifier: (id: number) => void
}

export interface Modifier {
  id: number
  name: string
  description: string
  hasPrice: boolean
  price: number
  created_at: string
  clave: Clave
  categories: Category[]
}
export interface ModifierTableProps {
  id: number
  name: string
  description: string
  hasPrice: string
  price: string
  created_at: string
  categories: JSX.Element[]
}
export interface Clave {
  id: number
  palabra: string
  clave: string
  tipo_clave: string
  created_at: string
}
export interface ModifierInputs {
  name: string
  description: string
  categoryIds: number[]
  hasPrice: boolean
  price?: number
  claveData: ClaveInputs
}

export interface ClaveInputs {
  palabra: string
  clave: string
}
