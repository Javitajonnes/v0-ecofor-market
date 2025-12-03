"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X, Loader2, RefreshCw } from "lucide-react"

const TEST_USERS = [
  { email: "admin@ecoformarket.com", password: "admin123", role: "Admin" },
  { email: "cliente1@email.com", password: "cliente123", role: "Cliente Minorista" },
  { email: "cliente2@email.com", password: "cliente123", role: "Cliente Minorista" },
  { email: "empresa1@email.com", password: "empresa123", role: "Cliente Mayorista" },
  { email: "empresa2@email.com", password: "empresa123", role: "Cliente Mayorista" },
]

interface TestResult {
  email: string
  role: string
  success: boolean
  message: string
}

export default function TestLoginPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [customEmail, setCustomEmail] = useState("")
  const [customPassword, setCustomPassword] = useState("")
  const [customResult, setCustomResult] = useState<TestResult | null>(null)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const testLogin = async (email: string, password: string, roleName: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      return {
        email,
        role: roleName,
        success: response.ok,
        message: response.ok ? `✓ Login exitoso - Usuario: ${data.user.name}` : `✗ Error: ${data.error}`,
      }
    } catch (error) {
      return {
        email,
        role: roleName,
        success: false,
        message: `✗ Error de conexión: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }

  const resetTestPasswords = async () => {
    setResetLoading(true)
    setResetMessage(null)

    try {
      const response = await fetch("/api/auth/reset-test-passwords", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResetMessage({
          type: "success",
          text: `✓ Contraseñas actualizadas correctamente. Ahora puedes probar los tests de login.`,
        })
      } else {
        setResetMessage({
          type: "error",
          text: `✗ Error: ${data.error || "No se pudieron actualizar las contraseñas"}`,
        })
      }
    } catch (error) {
      setResetMessage({
        type: "error",
        text: `✗ Error de conexión: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setResetLoading(false)
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    setResults([])

    const testResults: TestResult[] = []

    for (const user of TEST_USERS) {
      const result = await testLogin(user.email, user.password, user.role)
      testResults.push(result)
      setResults([...testResults])
      // Pequeña pausa entre tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setLoading(false)
  }

  const testCustomLogin = async () => {
    if (!customEmail || !customPassword) return

    setLoading(true)
    setCustomResult(null)

    const result = await testLogin(customEmail, customPassword, "Custom")
    setCustomResult(result)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Test de Autenticación</h1>
          <p className="text-muted-foreground">Verificación del sistema de login para todos los usuarios de prueba</p>
        </div>

        <Card className="p-6 space-y-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Resetear Contraseñas de Prueba</h2>
            <p className="text-sm text-muted-foreground">
              Si los tests fallan, usa este botón para actualizar las contraseñas de todos los usuarios de prueba en la
              base de datos.
            </p>
          </div>

          <Button
            onClick={resetTestPasswords}
            disabled={resetLoading}
            variant="outline"
            className="w-full bg-transparent"
          >
            {resetLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando contraseñas...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resetear Contraseñas en Base de Datos
              </>
            )}
          </Button>

          {resetMessage && (
            <div
              className={`p-4 rounded-lg border ${
                resetMessage.type === "success"
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-start gap-3">
                {resetMessage.type === "success" ? (
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-sm">{resetMessage.text}</div>
              </div>
            </div>
          )}
        </Card>

        {/* Test Automático */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Test Automático de Usuarios</h2>
            <p className="text-sm text-muted-foreground">
              Prueba el login de todos los usuarios de prueba configurados en la base de datos
            </p>
          </div>

          <Button onClick={runAllTests} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Probando usuarios...
              </>
            ) : (
              "Ejecutar Tests de Login"
            )}
          </Button>

          {results.length > 0 && (
            <div className="space-y-2 mt-6">
              <h3 className="font-semibold text-foreground mb-3">Resultados:</h3>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {result.role} - {result.email}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{result.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Test Manual */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Test Manual</h2>
            <p className="text-sm text-muted-foreground">Prueba credenciales personalizadas</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="usuario@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button onClick={testCustomLogin} disabled={loading || !customEmail || !customPassword} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Probando...
                </>
              ) : (
                "Probar Login"
              )}
            </Button>

            {customResult && (
              <div
                className={`p-4 rounded-lg border ${
                  customResult.success
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  {customResult.success ? (
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm">{customResult.message}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Lista de Usuarios de Prueba */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Usuarios de Prueba Disponibles</h3>
          <div className="space-y-3">
            {TEST_USERS.map((user, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{user.role}</div>
                    <div className="text-xs text-muted-foreground mt-1">{user.email}</div>
                  </div>
                  <code className="text-xs bg-background px-2 py-1 rounded border">{user.password}</code>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
