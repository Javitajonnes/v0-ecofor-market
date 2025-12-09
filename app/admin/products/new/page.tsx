'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useStore } from '@/lib/store'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  'Papel Higiénico',
  'Toallas de Papel',
  'Servilletas',
  'Pañuelos',
  'Otros'
]

export default function NewProductPage() {
  const { user } = useStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    sku: '',
    price_retail: '',
    price_wholesale: '',
    min_wholesale_quantity: '10',
    stock: '0',
    image_url: '',
    is_featured: false,
    is_active: true,
    weight_kg: '',
    dimensions: ''
  })

  // Verificar admin access
  if (!user || user.role !== 'admin') {
    router.push('/')
    return null
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validaciones básicas
      if (!formData.name || !formData.category || !formData.sku || !formData.price_retail || !formData.price_wholesale) {
        setError('Por favor completa todos los campos requeridos')
        setLoading(false)
        return
      }

      // Validar precios
      const priceRetail = parseFloat(formData.price_retail)
      const priceWholesale = parseFloat(formData.price_wholesale)

      if (isNaN(priceRetail) || priceRetail <= 0) {
        setError('El precio retail debe ser un número mayor a 0')
        setLoading(false)
        return
      }

      if (isNaN(priceWholesale) || priceWholesale <= 0) {
        setError('El precio mayorista debe ser un número mayor a 0')
        setLoading(false)
        return
      }

      // Preparar datos para enviar
      const productData: any = {
        name: formData.name,
        category: formData.category,
        sku: formData.sku,
        price_retail: priceRetail,
        price_wholesale: priceWholesale,
        min_wholesale_quantity: parseInt(formData.min_wholesale_quantity) || 10,
        stock: parseInt(formData.stock) || 0,
        is_featured: formData.is_featured,
        is_active: formData.is_active
      }

      // Campos opcionales
      if (formData.description) productData.description = formData.description
      if (formData.brand) productData.brand = formData.brand
      if (formData.image_url) productData.image_url = formData.image_url
      if (formData.weight_kg) productData.weight_kg = parseFloat(formData.weight_kg)
      if (formData.dimensions) productData.dimensions = formData.dimensions

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/admin/products')
        }, 2000)
      } else {
        setError(data.error || 'Error al crear el producto')
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Agregar Nuevo Producto</h1>
          </div>
          <p className="text-muted-foreground">Completa el formulario para crear un nuevo producto</p>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="pt-6">
              <p className="text-green-700 dark:text-green-300 font-medium">
                ✅ Producto creado exitosamente! Redirigiendo...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Datos principales del producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del Producto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ej: Papel Higiénico Ecológico 40m"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descripción detallada del producto..."
                  className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Categoría <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    placeholder="Ej: EcoComfort"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">
                  SKU (Código Único) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value.toUpperCase())}
                  placeholder="Ej: PH-ECO-001"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  El SKU debe ser único. Se convertirá automáticamente a mayúsculas.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Precios y Stock</CardTitle>
              <CardDescription>Configura los precios y disponibilidad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price_retail">
                    Precio Retail (CLP) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price_retail"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_retail}
                    onChange={(e) => handleChange('price_retail', e.target.value)}
                    placeholder="8990"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_wholesale">
                    Precio Mayorista (CLP) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price_wholesale"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_wholesale}
                    onChange={(e) => handleChange('price_wholesale', e.target.value)}
                    placeholder="7490"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="min_wholesale_quantity">Cantidad Mínima Mayorista</Label>
                  <Input
                    id="min_wholesale_quantity"
                    type="number"
                    min="1"
                    value={formData.min_wholesale_quantity}
                    onChange={(e) => handleChange('min_wholesale_quantity', e.target.value)}
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Inicial</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
              <CardDescription>Datos opcionales del producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">URL de Imagen</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight_kg">Peso (kg)</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight_kg}
                    onChange={(e) => handleChange('weight_kg', e.target.value)}
                    placeholder="1.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensiones</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleChange('dimensions', e.target.value)}
                    placeholder="Ej: 20x15x10 cm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleChange('is_featured', checked)}
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Producto Destacado
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    Producto Activo
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Producto
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

