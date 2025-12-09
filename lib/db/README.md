# Database Utilities

Utilidades para conexión y operaciones con PostgreSQL usando `@neondatabase/serverless`.

## Configuración

### Variables de Entorno

Asegúrate de tener configurado `.env.local` con:

\`\`\`env
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5432/ecoformarket
\`\`\`

### Iniciar Base de Datos Local

\`\`\`bash
docker-compose up -d
\`\`\`

## 🔧 Uso

### Conexión Básica


\`\`\`typescript
import { getSql } from '@/lib/db'

const sql = getSql()

// Query simple
const users = await sql`SELECT * FROM users`

// Query con parámetros (seguros contra SQL injection)
const user = await sql`SELECT * FROM users WHERE email = ${email}`
\`\`\`

### Verificar Conexión

\`\`\`typescript
import { testConnection } from '@/lib/db'

const isConnected = await testConnection()
if (!isConnected) {
  console.error('No se pudo conectar a la base de datos')
}
\`\`\`

## Funciones Disponibles

### `getSql()`
Obtiene el cliente SQL de Neon Serverless (singleton).

### `testConnection()`
Verifica que la conexión a la base de datos funcione.

## 📚 Ejemplos

### Crear Usuario


\`\`\`typescript
import { getSql } from '@/lib/db'
import bcrypt from 'bcrypt'

const sql = getSql()
const passwordHash = await bcrypt.hash(password, 12)

const result = await sql`
  INSERT INTO users (email, password_hash, name) 
  VALUES (${email}, ${passwordHash}, ${name}) 
  RETURNING *
`
const newUser = result[0]
\`\`\`

### Query con JOIN


\`\`\`typescript
import { getSql } from '@/lib/db'

const sql = getSql()
const status = 'pending'

const orders = await sql`
  SELECT o.*, u.name as user_name 
  FROM orders o 
  JOIN users u ON o.user_id = u.id 
  WHERE o.status = ${status}
`
\`\`\`

### Buscar por ID


\`\`\`typescript
import { getSql } from '@/lib/db'

export async function getUserById(id: string) {
  const sql = getSql()
  const result = await sql`
    SELECT * FROM users WHERE id = ${id} AND is_active = true
  `
  return result[0] || null
}
\`\`\`

## ⚠️ Importante: Sintaxis de Tagged Templates

Con `@neondatabase/serverless` 1.0+, DEBES usar tagged templates:

\`\`\`typescript
// ✅ CORRECTO
const user = await sql`SELECT * FROM users WHERE id = ${userId}`

// ❌ INCORRECTO
const user = await sql('SELECT * FROM users WHERE id = $1', [userId])
\`\`\`

Las tagged templates previenen automáticamente SQL injection al interpolar valores de forma segura.

## Migración a Neon (Producción)

Cuando migres a Neon, solo necesitas cambiar el `DATABASE_URL` en las variables de entorno. El código funciona igual con Neon Cloud o PostgreSQL local en Docker.

Para Neon, puedes usar `@neondatabase/serverless` que ya está configurado en el proyecto:

```typescript
// Con Neon
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
const users = await sql`SELECT * FROM users`
```
