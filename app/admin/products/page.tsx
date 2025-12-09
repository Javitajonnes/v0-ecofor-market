'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { Package, Plus, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Product {
  id: string
  name: string
  description: string | null
  category: string
  brand: string | null
  sku: string
  price_retail: number
  price_wholesale: number
  min_wholesale_quantity: number
  stock: number
  image_url: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ProductsPage() {
  const { user } = useStore()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  useEffect(() => {
    // Verificar admin access
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }

    fetchProducts()
  }, [user, router])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?includeInactive=true')
      const data = await response.json()

      if (data.success) {
        setProducts(data.data)
      } else {
        setError(data.error || 'Error al cargar productos')
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      setDeletingId(productToDelete.id)
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        // Recargar la lista de productos
        await fetchProducts()
        setDeleteDialogOpen(false)
        setProductToDelete(null)
      } else {
        setError(data.error || 'Error al eliminar producto')
        setDeleteDialogOpen(false)
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message)
      setDeleteDialogOpen(false)
    } finally {
      setDeletingId(null)
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Gestión de Productos</h1>
            </div>
            <p className="text-muted-foreground">Administra el inventario y precios de productos</p>
          </div>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Cargando productos...</p>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        {!loading && !error && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total: {products.length} productos
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">
                  Activos: {products.filter(p => p.is_active).length}
                </Badge>
                <Badge variant="outline">
                  Inactivos: {products.filter(p => !p.is_active).length}
                </Badge>
              </div>
            </div>

            {products.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No hay productos registrados</p>
                  <Link href="/admin/products/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primer Producto
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id} className={!product.is_active ? 'opacity-60' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{product.name}</CardTitle>
                            {product.is_featured && (
                              <Badge variant="default">Destacado</Badge>
                            )}
                            {!product.is_active && (
                              <Badge variant="secondary">Inactivo</Badge>
                            )}
                          </div>
                          <CardDescription>
                            SKU: {product.sku} • {product.category}
                            {product.brand && ` • ${product.brand}`}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="outline" size="icon" title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            title="Eliminar"
                            onClick={() => handleDeleteClick(product)}
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Precio Retail</p>
                          <p className="text-lg font-semibold">{formatPrice(product.price_retail)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Precio Mayorista</p>
                          <p className="text-lg font-semibold text-green-600">
                            {formatPrice(product.price_wholesale)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Stock</p>
                          <p className={`text-lg font-semibold ${
                            product.stock === 0 ? 'text-destructive' :
                            product.stock < 10 ? 'text-orange-600' :
                            'text-foreground'
                          }`}>
                            {product.stock} unidades
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Cant. Mín. Mayorista</p>
                          <p className="text-lg font-semibold">{product.min_wholesale_quantity} unidades</p>
                        </div>
                      </div>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mt-4">{product.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span>Creado: {formatDate(product.created_at)}</span>
                        <span>Actualizado: {formatDate(product.updated_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción marcará el producto "{productToDelete?.name}" como inactivo.
                El producto no se mostrará en el catálogo público, pero se mantendrá en la base de datos.
                ¿Deseas continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

