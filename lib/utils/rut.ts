/**
 * Utilidades para validación y formato de RUT chileno
 */

/**
 * Limpia el RUT removiendo puntos y guión
 */
export function cleanRut(rut: string): string {
  return rut.replace(/[.-]/g, "")
}

/**
 * Formatea el RUT agregando puntos y guión
 * Ejemplo: 12345678-9 -> 12.345.678-9
 */
export function formatRut(value: string): string {
  // Limpiar el valor
  const cleaned = cleanRut(value)

  // Si está vacío, retornar vacío
  if (!cleaned) return ""

  // Separar número y dígito verificador
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1).toUpperCase()

  // Si solo hay un caracter, retornarlo sin formato
  if (body.length === 0) return dv

  // Formatear con puntos
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  return `${formatted}-${dv}`
}

/**
 * Calcula el dígito verificador de un RUT
 */
function calculateDV(rut: string): string {
  let sum = 0
  let multiplier = 2

  // Recorrer el RUT de derecha a izquierda
  for (let i = rut.length - 1; i >= 0; i--) {
    sum += Number.parseInt(rut[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = sum % 11
  const dv = 11 - remainder

  if (dv === 11) return "0"
  if (dv === 10) return "K"
  return dv.toString()
}

/**
 * Valida si un RUT es válido
 */
export function validateRut(rut: string): boolean {
  // Limpiar el RUT
  const cleaned = cleanRut(rut)

  // Validar longitud (mínimo 8 caracteres: 7 números + 1 dígito verificador)
  if (cleaned.length < 8 || cleaned.length > 9) {
    return false
  }

  // Separar cuerpo y dígito verificador
  const body = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1).toUpperCase()

  // Validar que el cuerpo sean solo números
  if (!/^\d+$/.test(body)) {
    return false
  }

  // Validar que el dígito verificador sea válido
  if (!/^[0-9K]$/.test(dv)) {
    return false
  }

  // Calcular y comparar el dígito verificador
  const calculatedDV = calculateDV(body)

  return dv === calculatedDV
}

/**
 * Normaliza un RUT para guardarlo en la base de datos
 * Retorna el RUT limpio sin puntos ni guión
 */
export function normalizeRut(rut: string): string {
  const cleaned = cleanRut(rut)
  // Agregar guión antes del último caracter
  return cleaned.slice(0, -1) + "-" + cleaned.slice(-1).toUpperCase()
}
