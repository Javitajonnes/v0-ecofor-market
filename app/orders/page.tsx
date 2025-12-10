'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { ArrowLeft, Package, Loader2, Calendar, DollarSign, MapPin, CheckCircle2, Truck, Clock } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  id: string
  product_name: string
  product_sku: string
  product_image: string | null
  quantity: number
  unit_price: number
  subtotal: number
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  payment_method: string | null
  shipping_address: string
  shipping_city: string | null
  shipping_region: string | null
  user_name: string
  user_email: string
  created_at: string
  confirmed_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  items: OrderItem[]
}

export default function OrdersPage() {
  const { user } = useStore()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [includeCancelled, setIncludeCancelled] = useState(false)

  useEffect(() => {
    // Verificar autenticación
    if (!user) {
      router.push('/login')
      return
    }

    // Solo minoristas y mayoristas pueden ver sus pedidos
    if (user.role === 'admin') {
      router.push('/admin/orders')
      return
    }

    fetchOrders()
  }, [user, router, includeCancelled])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/my-orders?includeCancelled=${includeCancelled}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
      } else {
        setError(data.error || 'Error al cargar pedidos')
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: any }> = {
      pending: { label: 'Pendiente', variant: 'outline', icon: Clock },
      confirmed: { label: 'Confirmado', variant: 'default', icon: CheckCircle2 },
      processing: { label: 'En Proceso', variant: 'default', icon: Clock },
      shipped: { label: 'Enviado', variant: 'default', icon: Truck },
      delivered: { label: 'Entregado', variant: 'default', icon: CheckCircle2 },
      cancelled: { label: 'Cancelado', variant: 'destructive', icon: Clock }
    }

    const config = statusConfig[status] || { label: status, variant: 'outline', icon: Clock }
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  if (!user || user.role === 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Mis Pedidos</h1>
          </div>
          <p className="text-muted-foreground">Historial de todos tus pedidos</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCancelled}
                  onChange={(e) => setIncludeCancelled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Incluir pedidos cancelados</span>
              </label>
            </div>
          </CardContent>
        </Card>

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
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-muted-foreground">Cargando pedidos...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total: {orders.length} pedidos
              </p>
            </div>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No tienes pedidos registrados</p>
                  <Link href="/">
                    <Button>
                      Ver Productos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id} className={order.status === 'cancelled' ? 'opacity-60' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">Pedido #{order.order_number}</CardTitle>
                            {getStatusBadge(order.status)}
                          </div>
                          <CardDescription className="flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(order.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(order.total_amount)}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Shipping Address */}
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Dirección de envío</p>
                        <p className="font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {order.shipping_address}
                          {order.shipping_city && `, ${order.shipping_city}`}
                          {order.shipping_region && `, ${order.shipping_region}`}
                        </p>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Productos ({order.items.length})</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.product_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  SKU: {item.product_sku} | Cantidad: {item.quantity} | 
                                  Precio unitario: {formatCurrency(item.unit_price)}
                                </p>
                              </div>
                              <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Method */}
                      {order.payment_method && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-1">Método de pago</p>
                          <p className="font-medium">{order.payment_method}</p>
                        </div>
                      )}

                      {/* Status Timeline */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t">
                        {order.confirmed_at && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmado: {formatDate(order.confirmed_at)}
                          </span>
                        )}
                        {order.shipped_at && (
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Enviado: {formatDate(order.shipped_at)}
                          </span>
                        )}
                        {order.delivered_at && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Entregado: {formatDate(order.delivered_at)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

