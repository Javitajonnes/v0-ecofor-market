'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useStore } from '@/lib/store'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatRut, validateRut } from '@/lib/utils/rut'

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
}

export default function EditUserPage() {
  const { user } = useStore()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

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
    role: 'retail',
    user_type: 'person',
    phone: '',
    address: '',
    city: '',
    region: '',
    company_name: '',
    is_active: true,
    email_verified: false
  })

  // Verificar admin access
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }

    fetchUser()
  }, [user, router, userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()

      if (data.success) {
        const userData: User = data.data
        setFormData({
          name: userData.name,
          email: userData.email,
          password: '',
          confirmPassword: '',
          rut: userData.rut,
          role: userData.role === 'admin' ? 'admin' : userData.role === 'retail_client' ? 'retail' : 'wholesale',
          user_type: userData.user_type,
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          region: userData.region || '',
          company_name: userData.company_name || '',
          is_active: userData.is_active,
          email_verified: userData.email_verified
        })
      } else {
        setError(data.error || 'Error al cargar usuario')
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Verificar admin access
  if (!user || user.role !== 'admin') {
    return null
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
      if (!formData.name || !formData.email || !formData.rut) {
        setError('Por favor completa todos los campos requeridos')
        setSaving(false)
        return
      }

      // Validar RUT
      if (!validateRut(formData.rut)) {
        setError('El RUT ingresado no es válido')
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

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('El email no es válido')
        setSaving(false)
        return
      }

      // Si es empresa, validar company_name
      if (formData.user_type === 'company' && !formData.company_name) {
        setError('El nombre de la empresa es requerido para usuarios tipo empresa')
        setSaving(false)
        return
      }

      // Preparar datos para enviar
      const userData: any = {
        name: formData.name,
        email: formData.email,
        rut: formData.rut,
        role: formData.role,
        user_type: formData.user_type,
        is_active: formData.is_active,
        email_verified: formData.email_verified
      }

      // Campos opcionales
      if (formData.phone) userData.phone = formData.phone
      if (formData.address) userData.address = formData.address
      if (formData.city) userData.city = formData.city
      if (formData.region) userData.region = formData.region
      if (formData.company_name) userData.company_name = formData.company_name

      // Si se cambia la contraseña
      if (changePassword) {
        userData.password = formData.password
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/admin/users')
        }, 2000)
      } else {
        setError(data.error || 'Error al actualizar el usuario')
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Cargando usuario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin/users">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Editar Usuario</h1>
          </div>
          <p className="text-muted-foreground">Modifica la información del usuario</p>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="pt-6">
              <p className="text-green-700 dark:text-green-300 font-medium">
                ✅ Usuario actualizado exitosamente! Redirigiendo...
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
              <CardDescription>Datos principales del usuario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre Completo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Correo Electrónico <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="usuario@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rut">
                    RUT <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="rut"
                    value={formData.rut}
                    onChange={(e) => handleRutChange(e.target.value)}
                    placeholder="12.345.678-9"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+56912345678"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="user_type">
                    Tipo de Usuario <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.user_type}
                    onValueChange={(value) => handleChange('user_type', value)}
                    required
                  >
                    <SelectTrigger id="user_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="person">Persona</SelectItem>
                      <SelectItem value="company">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">
                    Rol <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleChange('role', value)}
                    required
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="retail">Cliente Minorista</SelectItem>
                      <SelectItem value="wholesale">Cliente Mayorista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.user_type === 'company' && (
                <div className="space-y-2">
                  <Label htmlFor="company_name">
                    Nombre de la Empresa <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    placeholder="Ej: Mi Empresa S.A."
                    required={formData.user_type === 'company'}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Contraseña</CardTitle>
              <CardDescription>Cambiar contraseña (opcional)</CardDescription>
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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
              <CardDescription>Datos opcionales del usuario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Ej: Av. Principal 123"
                />
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

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    Usuario Activo
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email_verified"
                    checked={formData.email_verified}
                    onCheckedChange={(checked) => handleChange('email_verified', checked)}
                  />
                  <Label htmlFor="email_verified" className="cursor-pointer">
                    Email Verificado
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-4">
            <Link href="/admin/users">
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

