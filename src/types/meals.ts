export interface MealSlice {
  meals: Meal[]
  meal: Meal | null
  loading: boolean
  activeMeal: number | null
  getMeals: () => Promise<void>
  saveMeal: (data: MealInputs) => Promise<void>
  updateMeal: (id: number, data: MealInputs) => Promise<void>
  deleteMeal: (id: number) => void
  setActiveMeal: (id: number) => void
}

export interface Meal {
  id: number
  name: string
  description: string
  price: number
  category_id: number
  image_path?: string
}

export interface MealTableProps {
  id: number
  created_at: string
  name: string
  description: string
  price: number
  category_id: number
  image_path: string
}

export interface MealInputs {
  name: string
  description: string
  price: number
  category: number
}
