# Migración a Neon Serverless

## Cambios Realizados

Se migró la conexión a PostgreSQL de `pg` a `@neondatabase/serverless` para resolver problemas de compatibilidad con el entorno de ejecución de v0.

### Por qué este cambio

El paquete `pg` requiere módulos nativos de Node.js (`addon.node`) que no están disponibles en entornos edge/serverless como v0. `@neondatabase/serverless` es una implementación compatible con WebAssembly que funciona en cualquier entorno JavaScript.

### Ventajas

1. **Compatibilidad total con v0**: No requiere módulos nativos
2. **Optimizado para serverless**: Diseñado para edge runtime
3. **Sintaxis segura**: Tagged templates previenen SQL injection automáticamente
4. **Mejor rendimiento**: Optimizado para conexiones HTTP

### Configuración

La migración es transparente. Solo necesitas tener la variable de entorno:

\`\`\`env
DATABASE_URL=postgresql://usuario:password@host:5432/database
\`\`\`

### Uso


\`\`\`typescript
import { getSql } from '@/lib/db'

const sql = getSql()

// Queries con parámetros (seguros contra SQL injection)
const users = await sql`SELECT * FROM users WHERE email = ${email}`

// Query simple
const allUsers = await sql`SELECT * FROM users`
\`\`\`

### Sintaxis de Tagged Templates

Con `@neondatabase/serverless` 1.0+, debes usar tagged templates:

\`\`\`typescript
// ✅ CORRECTO
const user = await sql`SELECT * FROM users WHERE id = ${userId}`

// ❌ INCORRECTO (no usar $1, $2 placeholders)
const user = await sql.query('SELECT * FROM users WHERE id = $1', [userId])
\`\`\`

### Compatibilidad con Docker Local

`@neondatabase/serverless` funciona tanto con:
- Neon Cloud Database (producción)
- PostgreSQL local con Docker (desarrollo)

No requiere cambios en tu configuración de Docker.
