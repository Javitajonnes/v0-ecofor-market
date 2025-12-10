'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { ArrowLeft, BarChart3, DollarSign, Package, TrendingUp, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface OrderStats {
  totalOrders: number
  ordersByStatus: Array<{ status: string; count: number }>
  totalSales: number
  currentMonthSales: number
  currentMonthOrders: number
  recentOrders: number
  recentSales: number
  topProducts: Array<{
    name: string
    sku: string
    totalQuantity: number
    totalRevenue: number
  }>
}

export default function ReportsPage() {
  const { user } = useStore()
  const router = useRouter()
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar admin access
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }

    fetchStats()
  }, [user, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.error || 'Error al cargar estadísticas')
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      processing: 'En Proceso',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    }
    return labels[status] || status
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin/orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Reportes de Pedidos</h1>
          </div>
          <p className="text-muted-foreground">Estadísticas y análisis de ventas</p>
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
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-muted-foreground">Cargando estadísticas...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        {!loading && !error && stats && (
          <div className="grid gap-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Todos los tiempos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
                  <p className="text-xs text-muted-foreground">Todos los tiempos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.currentMonthSales)}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.currentMonthOrders} pedidos este mes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Últimos 7 Días</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.recentSales)}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.recentOrders} pedidos recientes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Orders by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Pedidos por Estado</CardTitle>
                <CardDescription>Distribución de pedidos según su estado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                  {stats.ordersByStatus.map((item) => (
                    <div key={item.status} className="text-center p-4 border rounded">
                      <p className="text-2xl font-bold">{item.count}</p>
                      <p className="text-sm text-muted-foreground">{getStatusLabel(item.status)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Top 10 productos de los últimos 30 días</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.topProducts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay datos de productos vendidos
                  </p>
                ) : (
                  <div className="space-y-2">
                    {stats.topProducts.map((product, index) => (
                      <div
                        key={product.sku}
                        className="flex items-center justify-between p-4 border rounded hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(product.totalRevenue)}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.totalQuantity} unidades
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

