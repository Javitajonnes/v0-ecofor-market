import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// Función para obtener la connection string
function getConnectionString(): string {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error("DATABASE_URL no está configurada en las variables de entorno")
  }
  return dbUrl
}

// Cliente SQL de Neon Serverless
let sqlClient: NeonQueryFunction<false, false> | null = null

export function getSql() {
  if (!sqlClient) {
    sqlClient = neon(getConnectionString(), {
      // Suprimimos el warning porque nuestra arquitectura es segura:
      // - La base de datos SOLO se accede desde API Routes (servidor)
      // - Los componentes cliente usan fetch() para llamar a las API Routes
      // - Nunca exponemos credenciales o consultas SQL al navegador
      disableWarningInBrowsers: true,
    })
  }
  return sqlClient
}

// Función para verificar conexión
export async function testConnection() {
  try {
    const sql = getSql()
    const result = await sql`SELECT NOW()`
    console.log("[v0] Database connected successfully:", result[0])
    return true
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    return false
  }
}

/**
 * @deprecated Use getSql() con tagged templates en su lugar:
 * const sql = getSql()
 * const result = await sql`SELECT * FROM users WHERE id = ${id}`
 */
export async function query(text: string, params?: any[]) {
  console.warn("[v0] DEPRECATED: query() ya no es soportado. Use getSql() con tagged templates.")
  throw new Error("query() está deprecado. Use getSql() con sintaxis de tagged templates: sql`SELECT...`")
}
