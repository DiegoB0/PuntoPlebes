export interface CategorySlice {
  categories: Category[]
  activeCategory: Category | null
  loading: boolean
  getCategories: () => Promise<void>
  saveCategory: (category: CategoryInputs) => Promise<void>
  updateCategory: (category: CategoryInputs, id: number) => Promise<void>
  deleteCategory: (id: number) => void
  setActiveCategory: (id: number) => void
}

export interface Category {
  id: number
  category_name: string
  menu_type: string
  created_at: string
}
export interface CategoryTableProps {
  id: number
  created_at: string
  category_name: string
  menu_type: string
}
export interface CategoryInputs {
  category_name: string
  menu_type: string
}
