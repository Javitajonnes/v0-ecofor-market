import { Pool } from 'pg'

// Función para obtener la connection string
function getConnectionString(): string {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error('DATABASE_URL no está configurada en las variables de entorno')
  }
  return dbUrl
}

// Pool lazy - se crea solo cuando se necesita
let poolInstance: Pool | null = null

function getPool(): Pool {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: getConnectionString(),
      // Configuración para desarrollo local con Docker
      max: 20, // Máximo de conexiones en el pool
      idleTimeoutMillis: 30000, // Cerrar conexiones inactivas después de 30s
      connectionTimeoutMillis: 2000, // Timeout al conectar
    })

    // Manejo de errores del pool
    poolInstance.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
  }
  return poolInstance
}

// Función helper para ejecutar queries
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await getPool().query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error', { text, error })
    throw error
  }
}

// Función helper para transacciones
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Exportar función para obtener el pool si es necesario
export { getPool as pool }

// Función para verificar conexión
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()')
    console.log('Database connected successfully:', result.rows[0])
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

