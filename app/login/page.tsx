'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Leaf, Mail, Lock, AlertCircle } from 'lucide-react'
import { useStore } from '@/lib/store'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión')
        setIsLoading(false)
        return
      }

      // Update store with user data
      login(data.user)
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary p-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>EcoforMarket - Productos Sostenibles</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link href="/recuperar-contrasena" className="text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Test Credentials Info */}
            <div className="rounded-lg bg-muted p-3 text-xs space-y-1">
              <p className="font-semibold text-muted-foreground">Usuarios de prueba:</p>
              <p>Admin: admin@ecofor.com / admin123</p>
              <p>Minorista: retail@ecofor.com / retail123</p>
              <p>Mayorista: wholesale@ecofor.com / wholesale123</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-primary font-medium hover:underline">
                Regístrate aquí
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
