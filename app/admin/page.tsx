'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { user } = useStore()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 156,
    totalUsers: 342,
    totalOrders: 89,
    revenue: 45678
  })

  useEffect(() => {
    // Verify admin access
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Bienvenido, {user.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 font-medium">+12%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 font-medium">+24%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 font-medium">+8%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 font-medium">+18%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Productos</CardTitle>
              <CardDescription>Administrar inventario y precios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">Ver Todos los Productos</Button>
              <Button className="w-full">Agregar Nuevo Producto</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administrar clientes y roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">Ver Todos los Usuarios</Button>
              <Button className="w-full">Crear Usuario</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>Gestionar y procesar pedidos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">Ver Todos los Pedidos</Button>
              <Button className="w-full">Reportes</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Nuevo pedido recibido', user: 'Cliente Minorista', time: 'Hace 5 minutos', status: 'success' },
                { action: 'Producto actualizado', user: 'Admin', time: 'Hace 15 minutos', status: 'info' },
                { action: 'Nuevo usuario registrado', user: 'Cliente Mayorista', time: 'Hace 1 hora', status: 'success' },
                { action: 'Stock bajo en producto', user: 'Sistema', time: 'Hace 2 horas', status: 'warning' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                  </div>
                  <Badge variant={activity.status === 'warning' ? 'destructive' : 'default'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
