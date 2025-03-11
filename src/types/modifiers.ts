export interface ModifierSlice {
  loading: boolean
  modifiers: Modifier[]
  activeModifier: Modifier | null
  saveModifier: (modifier: ModifierInputs) => Promise<boolean>
  updateModifier: (modifier: ModifierInputs, id: number) => Promise<void>
  deleteModifier: (id: number) => Promise<void>
  getModifiers: () => Promise<void>
  setActiveModifier: (modifier: Modifier) => void
}

export interface Modifier {
  id: number
  name: string
  description: string
  meal_type: string
  clave: number
  created_at: string
}

export interface ModifierInputs {
  name: string
  description: string
  meal_type: string
  clave: number // Select input for clave, possibly change for category
}
