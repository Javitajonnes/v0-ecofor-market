#!/usr/bin/env ts-node
/**
 * Script para regenerar las contraseñas de los usuarios de prueba
 * con el hash correcto de "Admin123!"
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno
config({ path: resolve(process.cwd(), '.env.local') })

import { query } from '../lib/db'
import bcrypt from 'bcrypt'

async function fixPasswords() {
  console.log('🔧 Regenerando contraseñas de usuarios de prueba...\n')

  const password = 'Admin123!'
  const saltRounds = 12
  
  console.log('🔒 Generando hash para contraseña: Admin123!')
  const passwordHash = await bcrypt.hash(password, saltRounds)
  console.log(`✅ Hash generado: ${passwordHash.substring(0, 30)}...\n`)

  // Actualizar todos los usuarios con el nuevo hash
  const result = await query(
    'UPDATE users SET password_hash = $1 WHERE email IN ($2, $3, $4, $5, $6) RETURNING email, name',
    [
      passwordHash,
      'admin@ecoformarket.com',
      'cliente1@email.com',
      'cliente2@email.com',
      'empresa1@email.com',
      'empresa2@email.com'
    ]
  )

  console.log('✅ Contraseñas actualizadas para los siguientes usuarios:')
  result.rows.forEach((user: any) => {
    console.log(`   - ${user.email} (${user.name})`)
  })

  console.log('\n✅ Todas las contraseñas han sido actualizadas a: Admin123!')
}

fixPasswords()
  .then(() => {
    console.log('\n✅ Proceso completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })

