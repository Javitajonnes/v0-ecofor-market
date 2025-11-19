'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { useStore } from '@/lib/store'
import { Minus, Plus, X } from 'lucide-react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { cart, userRole, updateQuantity, removeFromCart, cartTotal, clearCart } = useStore()

  const total = cartTotal(userRole)

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu carrito
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
            <SheetTrigger asChild>
              <Button>Comenzar a comprar</Button>
            </SheetTrigger>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {cart.map((item) => {
                const price = userRole === 'wholesale' 
                  ? item.product.wholesalePrice 
                  : item.product.retailPrice

                return (
                  <div key={item.product.id} className="flex gap-4 border-b pb-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.product.brand}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm font-bold mt-2">{formatPrice(price * item.quantity)}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <SheetFooter className="mt-6 space-y-4">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {userRole === 'wholesale' && (
                  <p className="text-xs text-muted-foreground text-right">
                    Precios mayoristas aplicados
                  </p>
                )}
              </div>
              <div className="w-full space-y-2">
                <Button className="w-full" size="lg">
                  Finalizar Compra
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearCart}
                >
                  Vaciar Carrito
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
