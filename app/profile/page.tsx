'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { ArrowLeft, Save, Loader2, User, Mail, Phone, MapPin, Building2, Shield } from 'lucide-react'
import Link from 'next/link'
import { formatRut, validateRut } from '@/lib/utils/rut'

interface UserProfile {
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
}

export default function ProfilePage() {
  const { user, login } = useStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rut: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    company_name: ''
  })

  useEffect(() => {
    // Verificar autenticación
    if (!user) {
      router.push('/login')
      return
    }

    fetchProfile()
  }, [user, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users/me')
      const data = await response.json()

      if (data.success) {
        const profile: UserProfile = data.data
        setFormData({
          name: profile.name,
          email: profile.email,
          password: '',
          confirmPassword: '',
          rut: profile.rut,
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          region: profile.region || '',
          company_name: profile.company_name || ''
        })
      } else {
        setError(data.error || 'Error al cargar perfil')
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleRutChange = (value: string) => {
    const formatted = formatRut(value)
    handleChange('rut', formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Validaciones básicas
      if (!formData.name || !formData.email) {
        setError('Por favor completa todos los campos requeridos')
        setSaving(false)
        return
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('El email no es válido')
        setSaving(false)
        return
      }

      // Si se cambia la contraseña, validar
      if (changePassword) {
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden')
          setSaving(false)
          return
        }

        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres')
          setSaving(false)
          return
        }
      }

      // Preparar datos para enviar
      const profileData: any = {
        name: formData.name,
        email: formData.email
      }

      // Campos opcionales
      if (formData.phone) profileData.phone = formData.phone
      if (formData.address) profileData.address = formData.address
      if (formData.city) profileData.city = formData.city
      if (formData.region) profileData.region = formData.region
      if (formData.company_name) profileData.company_name = formData.company_name

      // Si se cambia la contraseña
      if (changePassword) {
        profileData.password = formData.password
      }

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Actualizar el store con los nuevos datos
        if (data.data) {
          login({
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role === 'admin' ? 'admin' : 
                  data.data.role === 'retail_client' ? 'retail' : 
                  data.data.role === 'wholesale_client' ? 'wholesale' : 'guest'
          })
        }
        // Limpiar campos de contraseña
        setChangePassword(false)
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
      } else {
        setError(data.error || 'Error al actualizar el perfil')
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'retail_client':
        return 'Cliente Minorista'
      case 'wholesale_client':
        return 'Cliente Mayorista'
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          </div>
          <p className="text-muted-foreground">Gestiona tu información personal</p>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="pt-6">
              <p className="text-green-700 dark:text-green-300 font-medium">
                ✅ Perfil actualizado exitosamente!
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
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Datos básicos de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre Completo <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Correo Electrónico <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="usuario@email.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rut">RUT</Label>
                  <Input
                    id="rut"
                    value={formData.rut}
                    onChange={(e) => handleRutChange(e.target.value)}
                    placeholder="12.345.678-9"
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    El RUT no se puede modificar. Contacta con un administrador si necesitas cambiarlo.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+56912345678"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Información de Rol (solo lectura) */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Rol de Usuario</Label>
                </div>
                <Badge variant="outline" className="text-sm">
                  {getRoleLabel(user.role === 'admin' ? 'admin' : 
                               user.role === 'retail' ? 'retail_client' : 
                               'wholesale_client')}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  El rol de usuario no se puede modificar desde aquí. Contacta con un administrador si necesitas cambiarlo.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>Dirección y ubicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Ej: Av. Principal 123"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Ej: Santiago"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Región</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => handleChange('region', e.target.value)}
                    placeholder="Ej: Metropolitana"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {formData.company_name && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Información de Empresa</CardTitle>
                <CardDescription>Datos de tu empresa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Nombre de la Empresa</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleChange('company_name', e.target.value)}
                      placeholder="Ej: Mi Empresa S.A."
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Cambiar contraseña</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="changePassword"
                  checked={changePassword}
                  onCheckedChange={(checked) => {
                    setChangePassword(checked as boolean)
                    if (!checked) {
                      handleChange('password', '')
                      handleChange('confirmPassword', '')
                    }
                  }}
                />
                <Label htmlFor="changePassword" className="cursor-pointer">
                  Cambiar contraseña
                </Label>
              </div>

              {changePassword && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Nueva Contraseña <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required={changePassword}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Contraseña <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Repite la contraseña"
                      required={changePassword}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-4">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

