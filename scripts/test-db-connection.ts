#!/usr/bin/env ts-node
/**
 * Script para verificar la conexión a PostgreSQL
 * 
 * Uso: npx tsx scripts/test-db-connection.ts
 * O: npm run test:db (si agregas el script a package.json)
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno desde .env.local ANTES de importar otros módulos
config({ path: resolve(process.cwd(), '.env.local') })

// Verificar que DATABASE_URL esté cargada
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL no está configurada en .env.local')
  process.exit(1)
}

// Importar después de cargar las variables
import { testConnection, query } from '../lib/db'

async function main() {
  console.log('🔍 Verificando conexión a PostgreSQL...\n')

  // Test conexión básica
  const isConnected = await testConnection()
  
  if (!isConnected) {
    console.error('❌ No se pudo conectar a la base de datos')
    console.error('Verifica que:')
    console.error('1. Docker Compose esté corriendo: docker-compose up -d')
    console.error('2. DATABASE_URL esté configurado en .env.local')
    process.exit(1)
  }

  console.log('✅ Conexión exitosa!\n')

  // Test query de usuarios
  try {
    console.log('📊 Verificando tabla users...')
    const result = await query('SELECT COUNT(*) as count FROM users')
    console.log(`✅ Tabla users existe. Total usuarios: ${result.rows[0].count}\n`)
  } catch (error: any) {
    console.error('❌ Error al consultar tabla users:', error.message)
    console.error('💡 Ejecuta las migraciones: docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < scripts/migrations/001_initial_schema.sql')
    process.exit(1)
  }

  // Test query de productos
  try {
    console.log('📊 Verificando tabla products...')
    const result = await query('SELECT COUNT(*) as count FROM products')
    console.log(`✅ Tabla products existe. Total productos: ${result.rows[0].count}\n`)
  } catch (error: any) {
    console.error('❌ Error al consultar tabla products:', error.message)
    process.exit(1)
  }

  // Listar usuarios de prueba
  try {
    console.log('👥 Usuarios disponibles:')
    const result = await query(`
      SELECT email, role, name 
      FROM users 
      ORDER BY role, email
    `)
    
    result.rows.forEach((user: any) => {
      console.log(`  - ${user.email} (${user.role}) - ${user.name}`)
    })
    console.log('\n💡 Password por defecto: Admin123!')
  } catch (error: any) {
    console.error('❌ Error al listar usuarios:', error.message)
  }

  console.log('\n✅ Todas las verificaciones pasaron!')
  process.exit(0)
}

main().catch((error) => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})

