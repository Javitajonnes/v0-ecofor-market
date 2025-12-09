'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { Users, Plus, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  user_type: 'person' | 'company'
  role: string
  name: string
  company_name: string | null
  rut: string
  phone: string | null
  address: string | null
  city: string | null
  region: string | null
  is_active: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

export default function UsersPage() {
  const { user } = useStore()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar admin access
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }

    fetchUsers()
  }, [user, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users?includeInactive=true')
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
      } else {
        setError(data.error || 'Error al cargar usuarios')
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
      day: 'numeric'
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default">Administrador</Badge>
      case 'retail_client':
        return <Badge variant="outline">Cliente Minorista</Badge>
      case 'wholesale_client':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Cliente Mayorista</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getUserTypeLabel = (userType: string) => {
    return userType === 'person' ? 'Persona' : 'Empresa'
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
              <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
            </div>
            <p className="text-muted-foreground">Administra usuarios, roles y permisos</p>
          </div>
          <Link href="/admin/users/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Usuario
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
              <p className="text-muted-foreground">Cargando usuarios...</p>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        {!loading && !error && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total: {users.length} usuarios
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">
                  Activos: {users.filter(u => u.is_active).length}
                </Badge>
                <Badge variant="outline">
                  Inactivos: {users.filter(u => !u.is_active).length}
                </Badge>
                <Badge variant="outline">
                  Admins: {users.filter(u => u.role === 'admin').length}
                </Badge>
              </div>
            </div>

            {users.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No hay usuarios registrados</p>
                  <Link href="/admin/users/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primer Usuario
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {users.map((userItem) => (
                  <Card key={userItem.id} className={!userItem.is_active ? 'opacity-60' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{userItem.name}</CardTitle>
                            {getRoleBadge(userItem.role)}
                            {!userItem.is_active && (
                              <Badge variant="secondary">Inactivo</Badge>
                            )}
                            {userItem.email_verified && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {userItem.email}
                            </span>
                            <span>RUT: {userItem.rut}</span>
                            <span>Tipo: {getUserTypeLabel(userItem.user_type)}</span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {userItem.company_name && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Empresa</p>
                            <p className="font-medium">{userItem.company_name}</p>
                          </div>
                        )}
                        {userItem.phone && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                            <p className="font-medium flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {userItem.phone}
                            </p>
                          </div>
                        )}
                        {(userItem.city || userItem.region) && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Ubicación</p>
                            <p className="font-medium flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {[userItem.city, userItem.region].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                      {userItem.address && (
                        <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {userItem.address}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span>Creado: {formatDate(userItem.created_at)}</span>
                        <span>Actualizado: {formatDate(userItem.updated_at)}</span>
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

