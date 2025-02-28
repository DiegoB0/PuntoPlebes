export interface CategorySlice {
  categories: Category[]
  getCategories: () => Promise<void>
}

export interface Category {
  id: number
  created_at: string
  category_name: string
  menu_type: string
}
