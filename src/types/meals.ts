export interface MealSlice {
  meals: Meal[]
  getMeals: () => Promise<void>
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
