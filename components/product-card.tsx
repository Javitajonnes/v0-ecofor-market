'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Product, UserRole } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { useStore } from '@/lib/store'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ProductCardProps {
  product: Product
  userRole: UserRole
}

export function ProductCard({ product, userRole }: ProductCardProps) {
  const { addToCart } = useStore()
  const { toast } = useToast()

  const price = userRole === 'wholesale' ? product.wholesalePrice : product.retailPrice
  const showWholesaleInfo = userRole === 'wholesale' || userRole === 'admin'

  const handleAddToCart = () => {
    const quantity = userRole === 'wholesale' ? product.minWholesaleQty : 1
    addToCart(product, quantity)
    toast({
      title: "Producto agregado",
      description: `${product.name} agregado al carrito`,
    })
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
              -{product.discount}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
              Destacado
            </Badge>
          )}
          {userRole === 'admin' && (
            <Badge variant="outline" className="absolute bottom-2 left-2 bg-background/80">
              Stock: {product.stock}
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(price)}
              </span>
              {product.discount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(price / (1 - product.discount / 100))}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {price.toLocaleString('es-CL')} / {product.unit}
            </p>
          </div>

          {/* Wholesale Info */}
          {showWholesaleInfo && (
            <div className="mt-2 p-2 bg-accent/10 rounded text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio Mayorista:</span>
                <span className="font-medium">{formatPrice(product.wholesalePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cantidad mínima:</span>
                <span className="font-medium">{product.minWholesaleQty} un</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2" 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? 'Sin Stock' : 'Agregar'}
        </Button>
      </CardFooter>
    </Card>
  )
}
