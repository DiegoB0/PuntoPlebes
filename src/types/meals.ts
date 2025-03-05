import { Category } from "./categories"

export interface MealSlice {
  meals: Meal[]
  loading: boolean
  mealId: number | null
  activeMeal: Meal | null
  getMeals: () => Promise<void>
  saveMeal: (formData: FormData) => Promise<void>
  updateMeal: (id: number, formData: FormData) => Promise<void>
  deleteMeal: (id: number) => void
  setActiveMeal: (id: number) => void
  clearActiveMeal: () => void
}
export interface Clave {
  id: number
  palabra: string
  clave: string
  tipo_clave: string
}

export interface Meal {
  id: number
  name: string
  description: string
  price: number
  category: Category
  categoryId: number;
  image_url?: string
  image_id?: string
  isClaveApplied?: boolean
  clave?: Clave
}


export interface MealTableProps {
  id: number
  created_at: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

export interface MealInputs {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  image_url?: File | string;  // Cambiado a 'image' para coincidir con el FormData
  isClaveApplied?: boolean;
  palabra?: string;
  clave?: string;  // Solo string para el formulario
}