# Database Utilities

Utilidades para conexión y operaciones con PostgreSQL.

## Configuración

### Variables de Entorno

Asegúrate de tener configurado `.env.local` con:

```env
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5432/ecoformarket
```

### Iniciar Base de Datos Local

```bash
docker-compose up -d
```

## Uso

### Conexión Básica

```typescript
import { query } from '@/lib/db'

// Query simple
const result = await query('SELECT * FROM users WHERE email = $1', [email])
const users = result.rows
```

### Transacciones

```typescript
import { transaction } from '@/lib/db'

await transaction(async (client) => {
  await client.query('INSERT INTO orders ...')
  await client.query('INSERT INTO order_items ...')
  // Si algo falla, se hace rollback automático
})
```

### Verificar Conexión

```typescript
import { testConnection } from '@/lib/db'

const isConnected = await testConnection()
if (!isConnected) {
  console.error('No se pudo conectar a la base de datos')
}
```

## Funciones Disponibles

### `query(text, params?)`
Ejecuta una query SQL con parámetros preparados.

### `transaction(callback)`
Ejecuta múltiples queries en una transacción. Si alguna falla, se hace rollback automático.

### `testConnection()`
Verifica que la conexión a la base de datos funcione.

### `pool`
Pool de conexiones de PostgreSQL (uso directo si es necesario).

## Ejemplos

### Crear Usuario

```typescript
import { query } from '@/lib/db'
import bcrypt from 'bcrypt'

const passwordHash = await bcrypt.hash(password, 12)
const result = await query(
  'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *',
  [email, passwordHash, name]
)
const newUser = result.rows[0]
```

### Query con JOIN

```typescript
import { query } from '@/lib/db'

const result = await query(`
  SELECT o.*, u.name as user_name 
  FROM orders o 
  JOIN users u ON o.user_id = u.id 
  WHERE o.status = $1
`, ['pending'])
```

## Migración a Neon (Producción)

Cuando migres a Neon, solo necesitas cambiar el `DATABASE_URL` en las variables de entorno. El código funciona igual.

Para Neon, puedes usar `@neondatabase/serverless` en lugar de `pg`, pero la API es compatible:

```typescript
// Con Neon
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
const users = await sql`SELECT * FROM users`
```

