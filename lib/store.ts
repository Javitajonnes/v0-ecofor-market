'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product, UserRole } from './types'

interface StoreState {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartItemsCount: () => number
  cartTotal: (role: UserRole) => number
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      userRole: 'guest',
      setUserRole: (role) => set({ userRole: role }),
      cart: [],
      addToCart: (product, quantity = 1) => {
        const { cart } = get()
        const existingItem = cart.find(item => item.product.id === product.id)
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          set({ cart: [...cart, { product, quantity }] })
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.product.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
        } else {
          set({
            cart: get().cart.map(item =>
              item.product.id === productId ? { ...item, quantity } : item
            )
          })
        }
      },
      clearCart: () => set({ cart: [] }),
      cartItemsCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0)
      },
      cartTotal: (role) => {
        return get().cart.reduce((total, item) => {
          const price = role === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice
          return total + (price * item.quantity)
        }, 0)
      }
    }),
    {
      name: 'ecofor-storage'
    }
  )
)
