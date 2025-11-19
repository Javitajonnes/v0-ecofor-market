export type UserRole = 'admin' | 'retail' | 'wholesale' | 'guest'

export interface Product {
  id: string
  name: string
  brand: string
  description: string
  image: string
  retailPrice: number
  wholesalePrice: number
  minWholesaleQty: number
  stock: number
  category: string
  unit: string
  featured?: boolean
  discount?: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}
